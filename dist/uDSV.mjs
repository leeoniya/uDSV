/**
* Copyright (c) 2023, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* uDSV.js
* A small, fast CSV parser
* https://github.com/leeoniya/uDSV (v0.1.0)
*/

const comma = ',';
const quote = '"';
const tab   = '\t';
const pipe  = '|';
const semi  = ';';

const ISO8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3,})?(?:Z|[-+]\d{2}:?\d{2})$/;

const COL_DELIMS = [tab, pipe, semi, comma];
const CHUNK_SIZE = 5e3;

function genToTypedRows(cols, rows, objs = false) {
	let buf = objs ? '{' : '[';

	// todo, get this from schema assertion
	cols.forEach((col, ci) => {
		buf += objs ? `"${col}":` : '';

		let rv = `r[${ci}]`;

		let parseVal = rv;

		// row with a value to analyze
		let row = rows.find(r => r[ci] != null && r[ci] !== ''); // trim()?

		if (row != null) {
			let v = row[ci]; // trim()?

			// dates
			if (ISO8601.test(v))
				parseVal = `new Date(${rv})`;
			// numbers
			else if (!Number.isNaN(Number.parseFloat(v)))
				parseVal = `${rv} === 'NaN' ? NaN : Number.parseFloat(${rv})`;
			// bools (T/F? 1/0?)
			else if (/^(?:true|false|yes|no)$/i.test(v)) {
				let [c0, c1] = v;

				let t =
					c0 == 't' || c0 == 'f' ? 'true' :
					c0 == 'T' || c0 == 'F' ? (c1 == 'R' || c1 === 'A' ? 'TRUE' : 'True') :

					c0 == 'y' || c0 == 'n' ? 'yes' :
					c0 == 'Y' || c0 == 'N' ? (c1 == 'E' || c1 === 'O' ? 'YES'  : 'Yes')  :

					'';

				parseVal = `${rv} === '${t}' ? true : false`;
			}
			// json
			else if (v[0] === '[' || v[0] === '{') {
				try {
					JSON.parse(v);
					parseVal = `JSON.parse(${rv})`;
				} catch {}
			}
		}

		let empty = `${rv} === '' || ${rv} === 'null' || ${rv} === 'NULL' ? null : `;

		// let empty = `${rv} === '' ? undefined : `;  // trim()?

		buf += `${empty} ${parseVal},`;
	});

	buf += objs ? '}' : ']';

	let fnBody = `
		let arr = Array(rows.length);

		for (let i = 0; i < rows.length; i++) {
			let r = rows[i];   // trim()?
			arr[i] = ${buf};
		}

		return arr;
	`;

	let toObjFn = new Function('rows', fnBody);

	// console.log(fnBody);
	// console.log(toObjFn(chunk.slice(1, 5)));
	// process.exit();

	return toObjFn;
}

function genToCols(cols) {
	return new Function('chunk', `
		let cols = [${cols.map((n, i) => `Array(chunk.length)`).join(',')}];

		for (let i = 0; i < chunk.length; i++) {
			let row = chunk[i];
			${cols.map((n, i) => `cols[${i}][i] = row[${i}]`).join(';')};
		}

		return cols;
	`);
}

// https://www.loc.gov/preservation/digital/formats/fdd/fdd000323.shtml

// schema guesser
function schema(csvStr, limit) {
	limit ??= 10;

	// will fail if header contains line breaks in quoted value
	// will fail if single line without line breaks
	const firstRowMatch = csvStr.match(/(.*)(\r?\n?)/);

	const firstRowStr   = firstRowMatch[1];
	const rowDelim      = firstRowMatch[2];
	const colDelim      = COL_DELIMS.find(delim => firstRowStr.indexOf(delim) > -1);

	// TODO: detect single quotes?
	let hasQuotes = csvStr.indexOf(quote) > -1;

	let _toArrs = null;
	let _toObjs = null;
	let _toCols = null;

	const schema = {
		quote: hasQuotes ? quote : null,
		cols: {
			delim: colDelim,
			names: [],
		//	types: [], // ['s','n','b','e'], // enums?
		},
		rows: {
			delim: rowDelim,
		},
		toArrs: (chunk) => {
			_toArrs ??= genToTypedRows(header, firstRows, false);
			return _toArrs(chunk);
		},
		toObjs: (chunk) => {
			_toObjs ??= genToTypedRows(header, firstRows, true);
			return _toObjs(chunk);
		},
		toCols: (chunk) => {
			_toCols ??= genToCols(header);
			return _toCols(chunk);
		},
	};

	// trim values (unquoted, quoted), ignore empty rows, assertTypes, assertQuotes

	const sampleLen = 1024 * 8; // 8kb
	const _maxCols = firstRowStr.split(colDelim).length;
	const firstRows = [];
	parse(csvStr.slice(0, sampleLen), schema, chunk => firstRows.push(...chunk), false, limit, 1, _maxCols);
	const header = firstRows.shift();
	schema.cols.names = header; // todo: trim?
//	schema.cols.types = Array(header.length).fill('s');

/*
	// probe data for types
	firstRows.forEach(r => {
		r.forEach((val, colIdx) => {
			if (!Number.isNaN(+val))
				schema.cols.types[colIdx] = 'n';
			else {
			//	let lower = val.toLowerCase();

			//	if (lower === 'true' || lower === 'false')
			//		schema.cols.types[colIdx] = 'b';
			}
		});
	});
*/

	return schema;
}

function parse(csvStr, schema, cb, withEOF = true, chunkSize = CHUNK_SIZE, chunkLimit = null, _maxCols = null) {
	let colDelim = schema.cols.delim;
	let rowDelim = schema.rows.delim;
	let quote = schema.quote ?? '';

	let numCols = _maxCols || schema.cols.names.length;

	let _limit = chunkLimit != null;
	// uses a slower regexp path for schema probing
	let _probe = _maxCols != null && _limit;

	let rowDelimLen = rowDelim.length;

	let numChunks = 0;

	// this no-quote block is a 10% perf boost in V8, and 2x boost in JSC
	// it can be fully omitted without breaking anything
	if (quote === '') {
		let lines = csvStr.split(rowDelim);

		let partial = '';
		let len = lines.length;

		if (!withEOF) {
			len -= 1;
			partial = lines[len];
		}

		let rows = [];

		for (let i = 0; i < len; i++) {
			let line = lines[i];

			let row = line.split(colDelim);

			rows.push(row);

			if (rows.length === chunkSize) {
				cb(rows, numChunks++, '');
				rows = [];

				if (_limit && numChunks === chunkLimit)
					return;
			}
		}

		if (rows.length > 0 || partial !== '')
			cb(rows, numChunks++, partial);

		return;
	}

	let quoteChar = quote == '' ? 0 : quote.charCodeAt(0);
	let rowDelimChar = rowDelim.charCodeAt(0);
	let colDelimChar = colDelim.charCodeAt(0);

	// should this be * to handle ,, ?
	const takeToCommaOrEOL = _probe ? new RegExp(`[^${colDelim}${rowDelim}]+`, 'my') : null;

	const rowTpl = Array(numCols).fill('');

	// 0 = no
	// 1 = unquoted
	// 2 = quoted
	let inCol = 0;

	let pos = 0;
	let endPos = csvStr.length - 1;
	let linePos = 0;

	let rows = [];
	let v = "";
	let row = rowTpl.slice();

	let colIdx = 0;
	let lastColIdx = numCols - 1;
	let filledColIdx = -1;

	let c;

	while (pos <= endPos) {
		c = csvStr.charCodeAt(pos);

		if (inCol === 0) {
			if (c === quoteChar) {
				inCol = 2;
				pos += 1;

				if (pos > endPos)
					break;

				c = csvStr.charCodeAt(pos);
			}
			else if (c === colDelimChar || c === rowDelimChar) {
				// PUSH MACRO START
				row[colIdx] = v;
				filledColIdx = colIdx;
				colIdx += 1;

				pos += 1;
				v = "";

				if (c === rowDelimChar) {
					if (_probe && filledColIdx < lastColIdx && rows.length === 0) {
						row.length = rowTpl.length = filledColIdx + 1;
						lastColIdx = filledColIdx;
					}

					rows.push(row);

					if (rows.length === chunkSize) {
						cb(rows, numChunks++, '');
						rows = [];

						if (_limit && numChunks === chunkLimit)
							return;
					}

					row = rowTpl.slice();
					colIdx = 0;
					filledColIdx = -1;
					pos += rowDelimLen - 1;
					linePos = pos;
				}
				// PUSH MACRO END

				if (pos > endPos)
					break;

				c = csvStr.charCodeAt(pos);
			}
			else
				inCol = 1;
		}

		if (inCol === 2) {
			while (true) {
				if (c === quoteChar) {
					if (pos + 1 > endPos) { // TODO: test with chunk ending in closing ", even at EOL but not EOF
						pos = endPos + 1;
						break;
					}

					let cNext = csvStr.charCodeAt(pos + 1);

					if (cNext === quoteChar) {
						v += quote;
						pos += 2;

						if (pos > endPos) {
							pos = endPos + 1;
							break;
						}

						c = csvStr.charCodeAt(pos);
					}
					else {
						inCol = 0;
						pos += 1;
						// we have the next char, so can technically skip the redundant charCodeAt at top of loop, but tricky
					//	c = cNext;
						break;
					}
				}
				else {
					let pos2 = csvStr.indexOf(quote, pos);

					if (pos2 === -1) {
						pos = endPos + 1;
						break;
					}

					v += csvStr.slice(pos, pos2);
					pos = pos2;
					c = quoteChar;
				}
			}
		}
		else if (inCol === 1) {
			if (c === colDelimChar || c === rowDelimChar) {
				// PUSH MACRO START
				row[colIdx] = v;
				filledColIdx = colIdx;
				colIdx += 1;

				pos += 1;
				v = "";

				if (c === rowDelimChar) {
					if (_probe && filledColIdx < lastColIdx && rows.length === 0) {
						row.length = rowTpl.length = filledColIdx + 1;
						lastColIdx = filledColIdx;
					}

					rows.push(row);

					if (rows.length === chunkSize) {
						cb(rows, numChunks++, '');
						rows = [];

						if (_limit && numChunks === chunkLimit)
							return;
					}

					row = rowTpl.slice();
					colIdx = 0;
					filledColIdx = -1;
					pos += rowDelimLen - 1;
					linePos = pos;
				}
				// PUSH MACRO END

				inCol = 0;
			}
			else {
				if (_probe) {
					takeToCommaOrEOL.lastIndex = pos;
					let m = takeToCommaOrEOL.exec(csvStr)[0];
					v += m;
					pos += m.length;  // rowdelim when - 1
				}
				else {
					let pos2 = csvStr.indexOf(colIdx === lastColIdx ? rowDelim : colDelim, pos);

					if (pos2 === -1)
						pos2 = endPos + 1;

					v += csvStr.slice(pos, pos2);
					pos = pos2;
				}
			}
		}
	}

	if (withEOF && colIdx === lastColIdx) {
		row[colIdx] = v;
		rows.push(row);
		inCol = 0;
	}

	let partial = !withEOF && (
		inCol !== 0 ||
		(
			filledColIdx === -1 ? v !== '' :  // partial first col OR
			filledColIdx < lastColIdx         // not all cols filled
		)
	);

	cb(rows, numChunks++, partial ? csvStr.slice(linePos) : '');
}

// const parsed = {
// 	format: '',
// 	data: []
// };

export { parse, schema };

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
const BOOL_RE = /^(?:t(?:rue)?|f(?:alse)?|y(?:es)?|n(?:o)?|0|1)$/i;

const COL_DELIMS = [tab, pipe, semi, comma];
const CHUNK_SIZE = 1e3;

function boolTrue(v) {
	let [c0, c1 = ''] = v;

	return (
		c0 == '1' || c0 == '0' ? '1' :

		c0 == 't' || c0 == 'f' ? (c1 == '' ? 't' : 'true') :
		c0 == 'T' || c0 == 'F' ? (c1 == '' ? 'T' : c1 == 'R' || c1 === 'A' ? 'TRUE' : 'True') :

		c0 == 'y' || c0 == 'n' ? (c1 == '' ? 'y' : 'yes') :
		c0 == 'Y' || c0 == 'N' ? (c1 == '' ? 'Y' : c1 == 'E' || c1 === 'O' ? 'YES'  : 'Yes')  :

		''
	);
}

function isJSON(v) {
	if (v[0] === '[' || v[0] === '{') {
		try {
			JSON.parse(v);
			return true;
		} catch {}
	}

	return false;
}

const T_STRING  = 's';
const T_DATE    = 'd';
const T_NUMBER  = 'n';
const T_JSON    = 'j';
const T_BOOLEAN = 'b';

function guessType(ci, rows) {
	// row with a value to analyze
	let row = rows.findLast(r =>
		r[ci] !== ''     &&
		r[ci] !== 'null' &&
		r[ci] !== 'NULL' &&
		r[ci] !== 'NaN'
	);

	let t = T_STRING;

	if (row != null) {
		let v = row[ci];

		t = (
			ISO8601.test(v) ? T_DATE                        :
			+v === +v       ? T_NUMBER                      :
			BOOL_RE.test(v) ? T_BOOLEAN + ':' + boolTrue(v) :
			isJSON(v)       ? T_JSON                        :
			t
		);
	}

	return t;
}

function getValParseExpr(ci, col) {
	let { type } = col;

	let rv = `r[${ci}]`;

	let parseExpr =
		type    === T_DATE    ? `new Date(${rv})`                             :
		type    === T_JSON    ? `JSON.parse(${rv})`                           :
		type    === T_NUMBER  ? `+${rv}`                                      :
		type[0] === T_BOOLEAN ? `${rv} === '${type.slice(2)}' ? true : false` :
		rv;

	let { repl } = col;

	let nanExpr   = repl.NaN   !== void 0 && type === T_NUMBER ? `${rv} === 'NaN' ? ${repl.NaN} : `                       : '';
	let nullExpr  = repl.null  !== void 0                      ? `${rv} === 'null' || ${rv} === 'NULL' ? ${repl.null} : ` : '';
	let emptyExpr = repl.empty !== void 0                      ? `${rv} === '' ? ${repl.empty} : `                        : '';

	return `${emptyExpr} ${nullExpr} ${nanExpr} ${parseExpr}`;
}

const segsRe = /\w+(?:\[|\]?[\.\[]?|$)/gm;

function genToTypedRows(cols, objs = false, deep = false) {
	let buf = '';

	if (objs && deep) {
		let tplObj = {};
		let colIdx = 0;

		let paths = cols.map(c => c.name);

		do {
			let path = paths.shift();

			let segs = /\s/.test(path) ? [path] : [...path.matchAll(segsRe)].flatMap(m => m.map(m => m.replace(']', '')));

			let node = tplObj;
			do {
				let seg = segs.shift();

				let key = seg;
				let endChar = seg.at(-1);
				let hasKids = endChar == '.' || endChar == '[';

				if (hasKids) {
					key = seg.slice(0, -1);
					let nextNode = node[key] ?? (endChar == '.' ? {} : []);
					node = node[key] = nextNode;
				}
				else
					node[key] = `¦${colIdx}¦`;
			} while (segs.length > 0);

			colIdx++;
		} while (paths.length > 0);

		buf = JSON.stringify(tplObj).replace(/"¦(\d+)¦"/g, (m, ci) => getValParseExpr(+ci, cols[+ci]));
	}
	else {
		if (!objs && cols.every(c => c.type === T_STRING))
			buf = 'r';
		else {
			buf = objs ? '{' : '[';

			cols.forEach((col, ci) => {
				buf += objs ? `"${col.name.replaceAll('"', '\\"')}":` : '';
				let parseVal = getValParseExpr(ci, col);
				buf += `${parseVal},`;
			});

			buf += objs ? '}' : ']';
		}
	}

	let fnBody = `
		let arr = Array(rows.length);

		for (let i = 0; i < rows.length; i++) {
			let r = rows[i];
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
	return new Function('rows', `
		let cols = [${cols.map(() => `Array(rows.length)`).join(',')}];

		for (let i = 0; i < rows.length; i++) {
			let r = rows[i];
			${cols.map((c, i) => `cols[${i}][i] = r[${i}]`).join(';')};
		}

		return cols;
	`);
}

// https://www.loc.gov/preservation/digital/formats/fdd/fdd000323.shtml
function inferSchema(csvStr, opts, maxRows) {
	let {
		header: headerFn,
		col:    colDelim,
		row:    rowDelim,
		encl:   colEncl,
		esc:    escEncl,
	//	omit,  // #comments and empty lines (ignore:), needs callback for empty and comments?
		trim  = false,
	} = opts ?? {};

	// by default, grab first row, and skip it
	headerFn ??= firstRows => [firstRows[0]];

	maxRows ??= 10;

	// will fail if header contains line breaks in quoted value
	// will fail if single line without line breaks
	const rowRE         = new RegExp(`(.*)(${rowDelim ?? '\r\n|\r|\n'})`);
	const firstRowMatch = csvStr.match(rowRE);
	const firstRowStr   = firstRowMatch[1];

	rowDelim ??= firstRowMatch[2];
	colDelim ??= COL_DELIMS.find(delim => firstRowStr.indexOf(delim) > -1) ?? '';
	colEncl  ??= csvStr.indexOf(quote) > -1 ? quote : ''; 	// TODO: detect single quotes?
	escEncl  ??= colEncl;

	const schema = {
		skip: 1, // how many header rows to skip
		col:  colDelim,
		row:  rowDelim,
		encl: colEncl,
		esc:  escEncl,
		trim: trim,
		cols: [],
	};

	const _maxCols = firstRowStr.split(colDelim).length;

	const firstRows = [];
	parse(csvStr, schema, chunk => { firstRows.push(...chunk); }, 0, true, maxRows, 1, _maxCols);

	let headerRows = headerFn(firstRows) ?? [];

	let skip = schema.skip = headerRows.length;

	// first non-null row
	let colNames = headerRows.find(row => row != null) ?? [...Array(firstRows[0].length).keys()];

	firstRows.splice(0, skip);

	colNames.forEach((colName, colIdx) => {
		let type = guessType(colIdx, firstRows);

		let col = {
			name: colName,
			type,
			// this could be type-dependant (e.g. {empty: 0, null: 0, NaN: NaN} for numbers)
			repl: {
				empty: null,
				NaN: void 0,
				null: void 0,
			},
		};

		schema.cols.push(col);
	});

	return schema;
}

function initParser(schema, chunkSize) {
	let { skip, cols } = schema;

	let _toStrs = null;
	let _toArrs = null;
	let _toObjs = null;
	let _toDeep = null;

	let _toCols = null;

	let streamChunkNum = 0;
	let streamState = 0;
	let streamParse = null;
	let streamCb = null;
	let pendChunk = '';
	let prevUnparsed = '';

	let buf = null;

	function reset() {
		streamState = streamChunkNum = 0;
		prevUnparsed = pendChunk = '';
		streamParse = streamCb = buf = null;
	}

	let accum    = (rows, add) => { add(rows); };
	let initRows = () => [];
	let initCols = () => cols.map(c => []);
	let addRows  = rows => { buf.push(...rows); };
	let addCols  = cols => { cols.forEach((vals, ci) => { buf[ci].push(...vals); }); };

	function gen(accInit, accAppend, genConvertRows) {
		let convertRows = null;

		return (csvStr, cb = accum) => {
			convertRows ??= genConvertRows();

			buf ??= accInit();
			let out = buf;
			let withEOF = streamState === 0 || streamState === 2;

			let _skip = streamChunkNum === 0 ? skip : 0;

			parse(csvStr, schema, (rows, partial) => {
				prevUnparsed = partial;
				let res = cb(convertRows(rows), accAppend);

				if (res === false && streamState !== 0)
					reset();

				return res;
			}, _skip, withEOF, chunkSize);

			if (withEOF)
				buf = null;

			return out;
		};
	}

	const stringArrs = gen(initRows, addRows, () => {
		_toStrs ??= rows => rows;
		return _toStrs;
	});

	const typedArrs = gen(initRows, addRows, () => {
		_toArrs ??= genToTypedRows(cols, false, false);
		return _toArrs;
	});

	const typedObjs = gen(initRows, addRows, () => {
		_toObjs ??= genToTypedRows(cols, true, false);
		return _toObjs;
	});

	const typedDeep = gen(initRows, addRows, () => {
		_toDeep ??= genToTypedRows(cols, true, true);
		return _toDeep;
	});

	const typedCols = gen(initCols, addCols, () => {
		_toArrs ??= genToTypedRows(cols, false, false);
		_toCols ??= genToCols(cols);

		return rows => _toCols(_toArrs(rows));
	});

	return {
		schema,

		stringArrs,
		typedArrs,
		typedObjs,
		typedDeep,
		typedCols,

		chunk(csvStr, parse = stringArrs, cb = accum) {
			streamParse ??= parse;
			streamCb    ??= cb;

			let out = null;

			if (streamState === 1) {
				out = streamParse(prevUnparsed + pendChunk, streamCb);
				streamChunkNum++;
			}

			pendChunk = csvStr;
			streamState = 1;
			return out;
		},
		end() {
			streamState = 2;
			let out = streamParse(prevUnparsed + pendChunk, streamCb);
			reset();
			return out;
		},
	};
}

function parse(csvStr, schema, cb, skip = 0, withEOF = true, chunkSize = CHUNK_SIZE, chunkLimit = null, _maxCols = null) {
	let {
		row:  rowDelim,
		col:  colDelim,
		encl: colEncl,
		esc:  escEncl,
		trim,
	} = schema;

	let numCols = _maxCols || schema.cols.length;

	let _limit = chunkLimit != null;
	// uses a slower regexp path for schema probing
	let _probe = _maxCols != null && _limit;

	let rowDelimLen = rowDelim.length;
	let colDelimLen = colDelim.length;

	let numChunks = 0;

	let pos = 0;
	let endPos = csvStr.length - 1;
	let linePos = 0;

	let rows = [];
	let rowTpl = Array(numCols).fill('');
	let row = rowTpl.slice();

	let colIdx = 0;
	let lastColIdx = numCols - 1;
	let filledColIdx = -1;

	if (colEncl === '') {
		while (pos <= endPos) {
			if (colIdx === lastColIdx) {
				let pos2 = csvStr.indexOf(rowDelim, pos);

				if (pos2 === -1) {
					if (!withEOF)
						break;

					pos2 = endPos + 1;
				}

				let s = csvStr.slice(pos, pos2);
				row[colIdx] = trim ? s.trim() : s;

				--skip < 0 && rows.push(row);

				if (rows.length === chunkSize) {
					let stop = cb(rows, '') === false;
					rows = [];

					if (stop || _limit && ++numChunks === chunkLimit)
						return;
				}

				row = rowTpl.slice();
				colIdx = 0;
				filledColIdx = -1;
				pos = pos2 + rowDelimLen;
				linePos = pos;
			}
			else {
				let pos2 = csvStr.indexOf(colDelim, pos);

				if (pos2 === -1) {
					if (!withEOF)
						break;
				}

				let s = csvStr.slice(pos, pos2);
				row[colIdx] = trim ? s.trim() : s;
				pos = pos2 + colDelimLen;
				filledColIdx = colIdx++;
			}
		}

		if (!withEOF || rows.length > 0)
			cb(rows, !withEOF ? csvStr.slice(linePos) : '');

		return;
	}

	let colEnclChar  = colEncl.charCodeAt(0);
	let escEnclChar  = escEncl.charCodeAt(0);
	let rowDelimChar = rowDelim.charCodeAt(0);
	let colDelimChar = colDelim.charCodeAt(0);
	let spaceChar    = 32;

	// should this be * to handle ,, ?
	const takeToCommaOrEOL = _probe ? new RegExp(`[^${colDelim}${rowDelim}]+`, 'my') : null;

	// 0 = no
	// 1 = unquoted
	// 2 = quoted
	let inCol = 0;

	let v = "";
	let c;

	while (pos <= endPos) {
		c = csvStr.charCodeAt(pos);

		if (inCol === 0) {
			if (c === colEnclChar) {
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

					--skip < 0 && rows.push(row);

					if (rows.length === chunkSize) {
						let stop = cb(rows, '') === false;
						rows = [];

						if (stop || _limit && ++numChunks === chunkLimit)
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
			else {
				if (trim && c === spaceChar) {
					while (c === spaceChar)
						c = csvStr.charCodeAt(++pos);
				}
				else
					inCol = 1;
			}
		}

		if (inCol === 2) {
			while (true) {
				if (c === colEnclChar) {
					if (colEnclChar === escEnclChar) {
						if (pos + 1 > endPos) { // TODO: test with chunk ending in closing ", even at EOL but not EOF
							pos = endPos + 1;
							break;
						}

						let cNext = csvStr.charCodeAt(pos + 1);

						if (cNext === colEnclChar) {
							pos += 2;

							// MACRO START
							v += colEncl;
							if (pos > endPos)
								break;
							c = csvStr.charCodeAt(pos);
							// MACRO END
						}
						else {
							inCol = 0;
							pos += 1;
							break;
						}
					}
					else {
						let cPrev = csvStr.charCodeAt(pos - 1);

						if (cPrev === escEnclChar) {
							pos += 1;

							// MACRO START
							v += colEncl;
							if (pos > endPos)
								break;
							c = csvStr.charCodeAt(pos);
							// MACRO END
						}
						else {
							inCol = 0;
							pos += 1;
							break;
						}
					}
				}
				else {
					let pos2 = csvStr.indexOf(colEncl, pos);

					if (pos2 === -1) {
						pos = endPos + 1;
						break;
					}

					v += csvStr.slice(pos, colEnclChar === escEnclChar ? pos2 : pos2 - 1);
					pos = pos2;
					c = colEnclChar;
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

					--skip < 0 && rows.push(row);

					if (rows.length === chunkSize) {
						let stop = cb(rows, '') === false;
						rows = [];

						if (stop || _limit && ++numChunks === chunkLimit)
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

					let s = csvStr.slice(pos, pos2);
					v += trim ? s.trim() : s;
					pos = pos2;
				}
			}
		}
	}

	if (withEOF && colIdx === lastColIdx) {
		row[colIdx] = v;
		--skip < 0 && rows.push(row);
		inCol = 0;
	}

	let partial = !withEOF && (
		inCol !== 0 ||
		(
			filledColIdx === -1 ? v !== '' :  // partial first col OR
			filledColIdx < lastColIdx         // not all cols filled
		)
	);

	cb(rows, partial ? csvStr.slice(linePos) : '');
}

// const parsed = {
// 	format: '',
// 	data: []
// };

export { inferSchema, initParser };

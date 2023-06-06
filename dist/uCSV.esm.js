/**
* Copyright (c) 2023, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* uCSV.js
* A small, fast CSV parser
* https://github.com/leeoniya/uCSV (v0.1.0)
*/

const comma = ',';
const quote = '"';
const tab   = '\t';
const pipe  = '|';
const semi  = ';';

const countQuotes = str => str.match(/"/g)?.length ?? 0;

// https://www.loc.gov/preservation/digital/formats/fdd/fdd000323.shtml

// schema guesser
function schema(csvStr) {
	// will fail if header contains line breaks in quoted value
	// will fail if single line without line breaks
	const firstRowMatch = csvStr.match(/(.*)(\r?\n?)/);

	const firstRowStr   = firstRowMatch[1];
	const rowDelim      = firstRowMatch[2];
	const colDelim      = (
		firstRowStr.indexOf(tab)  > -1 ? tab  :
		firstRowStr.indexOf(pipe) > -1 ? pipe :
		firstRowStr.indexOf(semi) > -1 ? semi :
	//	firstRowStr.indexOf(colo) > -1 ? colo :
		comma
	);

	// TODO: detect single quotes?
	let hasQuotes = countQuotes(firstRowStr) > 1;

	// probe 2500 data chars for quotes
	if (!hasQuotes) {
		let from = firstRowMatch.index;
		hasQuotes = countQuotes(csvStr.slice(from, from + 2500)) > 1;
	}

	const schema = {
		quote: hasQuotes ? quote : '',
		cols: {
			delim: colDelim,
			names: [],
			types: [], // ['s','n','b','e'], // enums?
		},
		rows: {
			delim: rowDelim,
		},
	};

	// trim values (unquoted, quoted), ignore empty rows, assertTypes, assertQuotes

	const _maxCols = firstRowStr.match(new RegExp(colDelim, 'g')).length + 1;
	const limit = 10;
	const firstRows = _parseAllTuples(csvStr, schema, limit, _maxCols);
	const header = Object.keys(firstRows.shift());
	schema.cols.names = header; // todo: trim?
	schema.cols.types = Array(header.length).fill('s');

	// probe data for types
	firstRows.forEach(r => {
		r.forEach((val, colIdx) => {
			if (!Number.isNaN(+val))
				schema.cols.types[colIdx] = 'n';
		/*
			else {
				let lower = val.toLowerCase();

				if (lower === 'true' || lower === 'false')
					schema.cols.types[colIdx] = 'b';
			}
		*/
		});
	});

	return schema;
}

function parse(csvStr, schema, limit) {
	return _parseAllTuples(csvStr, schema, limit);
}

function _parseAllTuples(csvStr, schema, limit, _maxCols) {
	let colDelim = schema.cols.delim;
	let rowDelim = schema.rows.delim;

	let numCols = _maxCols || schema.cols.names.length;

	// uses a slower regexp path for schema probing
	let _probe = !!(_maxCols && limit);

	if (!schema.quote) {
		let rows = csvStr.split(rowDelim);
		rows = limit ? rows.slice(0, limit) : rows;
		return rows.map(row => row.split(colDelim));
	}

	let rowDelimLen  = rowDelim.length;
	let rowDelimChar = rowDelim[0];
	let colDelimChar = colDelim[0];
	const takeToCommaOrEOL = _probe ? new RegExp(`[^${colDelim}${rowDelim}]+`, 'my') : null;

	// 0 = no
	// 1 = unquoted
	// 2 = quoted
	let inCol = 0;

	let pos = 0;
	let endPos = csvStr.length - 1;

	let rows = [];
	let v = "";
	let row = Array(numCols);

	let colIdx = 0;
	let lastColIdx = numCols - 1;

	while (pos <= endPos) {
		let c = csvStr[pos];

		if (inCol === 0) {
			if (c === quote) {
				inCol = 2;
				pos += 1;
			}
			else if (c === colDelimChar || c === rowDelimChar) {
				// PUSH MACRO START
				row[colIdx] = v;
				colIdx += 1;

				pos += 1;
				v = "";

				if (c === rowDelimChar) {
					rows.push(row);

					if (limit && rows.length === limit)
						return rows;

					row = Array(numCols);
					colIdx = 0;
					pos += rowDelimLen - 1;
				}
				// PUSH MACRO END
			}
			else
				inCol = 1;
		}
		else if (inCol === 2) {
			if (c === quote) {
				if (csvStr[pos + 1] === quote) {
					v += '"';
					pos += 2;
				}
				else {
					inCol = 0;
					pos += 1;
				}
			}
			else {
				let pos2 = csvStr.indexOf(quote, pos);
				v += csvStr.slice(pos, pos2);
				pos = pos2;
			}
		}
		else if (inCol === 1) {
			if (c === colDelimChar || c === rowDelimChar) {
				// PUSH MACRO START
				row[colIdx] = v;
				colIdx += 1;

				pos += 1;
				v = "";

				if (c === rowDelimChar) {
					rows.push(row);

					if (limit && rows.length === limit)
						return rows;

					row = Array(numCols);
					colIdx = 0;
					pos += rowDelimLen - 1;
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
					let pos2;

					if (colIdx === lastColIdx) {
						pos2 = csvStr.indexOf(rowDelim, pos);

						if (pos2 === -1)
							pos2 = csvStr.length;
					}
					else
						pos2 = csvStr.indexOf(colDelim, pos);

					v += csvStr.slice(pos, pos2);
					pos = pos2;
				}
			}
		}
	}

	row[colIdx] = v;
	rows.push(row);

	return rows;
}

// const data = {
// 	format: '',
// 	values: []
// };

export { parse, schema };

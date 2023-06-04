/**
* Copyright (c) 2023, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* uCSV.js
* A small, fast CSV parser
* https://github.com/leeoniya/uCSV (v0.1.0)
*/

'use strict';

// const takeToQuote      = /[^"]+/my;
// const takeToCommaOrEOL = /[^,\n]+/my;
const quote   =  '"'.charCodeAt(0);
// const comma   =  ','.charCodeAt(0);
// const cr      = '\r'.charCodeAt(0);
// const lf      = '\n'.charCodeAt(0);
// const tab     = '\t'.charCodeAt(0);

function parse(csvStr) {
	const firstRow = csvStr.match(/(.*)(\r?\n?)/);
	const maxCols = Math.min(500, firstRow[1].length);
	const rowDelim = firstRow[2];
	const colDelim = /\t/.test(firstRow[1]) ? '\t' : ',';
	const header = _parse(firstRow[1], maxCols, rowDelim, colDelim)[0];
	const numCols = Object.keys(header).length;

	return  _parse(csvStr, numCols, rowDelim, colDelim);
}

function _parse(csvStr, numCols = 500, rowDelim = '\n', colDelim = ',') {
	let rowDelimLen = rowDelim.length;
	let rowDelimCode = rowDelim[0].charCodeAt(0);
	let colDelimCode = colDelim[0].charCodeAt(0);

	const takeToQuote      = new RegExp('[^"]+', 'my');
	const takeToCommaOrEOL = new RegExp(`[^${colDelim}${rowDelim}]+`, 'my');

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

	while (pos <= endPos) {
		let c = csvStr.charCodeAt(pos);

		if (inCol === 0) {
			if (c === quote) {
				inCol = 2;
				pos += 1;
			}
			else if (c === colDelimCode || c === rowDelimCode) {
				// PUSH MACRO START
				row[colIdx] = v;
				colIdx += 1;

				pos += 1;
				v = "";

				if (c === rowDelimCode) {
					rows.push(row);
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
				if (csvStr.charCodeAt(pos + 1) === quote) {
					v += '"';
					pos += 2;
				}
				else {
					inCol = 0;
					pos += 1;
				}
			}
			else {
				takeToQuote.lastIndex = pos;
				let m = takeToQuote.exec(csvStr)[0];
				v += m;
				pos += m.length;
			}
		}
		else if (inCol === 1) {
			if (c === colDelimCode || c === rowDelimCode) {
				// PUSH MACRO START
				row[colIdx] = v;
				colIdx += 1;

				pos += 1;
				v = "";

				if (c === rowDelimCode) {
					rows.push(row);
					row = Array(numCols);
					colIdx = 0;
					pos += rowDelimLen - 1;
				}
				// PUSH MACRO END

				inCol = 0;
			}
			else {
				takeToCommaOrEOL.lastIndex = pos;
				let m = takeToCommaOrEOL.exec(csvStr)[0];
				v += m;
				pos += m.length;
			}
		}
	}

	row[colIdx] = v;
	rows.push(row);

	return rows;
}

exports.parse = parse;

/**
* Copyright (c) 2023, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* uDSV.js
* A small, fast CSV parser
* https://github.com/leeoniya/uDSV (v0.1.0)
*/

var uDSV = (function (exports) {
	'use strict';

	const comma = ',';
	const quote = '"';
	const tab   = '\t';
	const pipe  = '|';
	const semi  = ';';

	const COL_DELIMS = [tab, pipe, semi, comma];
	const CHUNK_SIZE = 5e3;

	// https://www.loc.gov/preservation/digital/formats/fdd/fdd000323.shtml

	// schema guesser
	function schema(csvStr, limit = 10) {
		// will fail if header contains line breaks in quoted value
		// will fail if single line without line breaks
		const firstRowMatch = csvStr.match(/(.*)(\r?\n?)/);

		const firstRowStr   = firstRowMatch[1];
		const rowDelim      = firstRowMatch[2];
		const colDelim      = COL_DELIMS.find(delim => firstRowStr.indexOf(delim) > -1);

		// TODO: detect single quotes?
		let hasQuotes = csvStr.indexOf(quote) > -1;

		const schema = {
			quote: hasQuotes ? quote : null,
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

		const _maxCols = firstRowStr.split(colDelim).length;
		const firstRows = [];
		parse(csvStr, schema, chunk => firstRows.push(...chunk), limit, 1, _maxCols);
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

	function parse(csvStr, schema, cb, chunkSize = CHUNK_SIZE, chunkLimit = null, _maxCols = null) {
		let colDelim = schema.cols.delim;
		let rowDelim = schema.rows.delim;

		let numCols = _maxCols || schema.cols.names.length;

		let _limit = chunkLimit != null;
		// uses a slower regexp path for schema probing
		let _probe = _maxCols != null && _limit;

		let rowDelimLen = rowDelim.length;

		let numChunks = 0;

		if (schema.quote == null) {
			let rows = [];

			let pos = 0;
			let idx = -1;

			while ((idx = csvStr.indexOf(rowDelim, pos)) > -1) {
				rows.push(csvStr.slice(pos, idx).split(colDelim));
				pos = idx + rowDelimLen;

				if (rows.length === chunkSize) {
					cb(rows);
					rows = [];

					if (_limit && ++numChunks === chunkLimit)
						break;
				}
			}

			if (rows.length > 0)
				cb(rows);

			return;
		}

		let quoteChar = quote.charCodeAt(0);
		let rowDelimChar = rowDelim.charCodeAt(0);
		let colDelimChar = colDelim.charCodeAt(0);

		// should this be * to handle ,, ?
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

		let c;

		while (pos <= endPos) {
			c = csvStr.charCodeAt(pos);

			if (inCol === 0) {
				if (c === quoteChar) {
					inCol = 2;
					pos += 1;

					c = csvStr.charCodeAt(pos);
				}
				else if (c === colDelimChar || c === rowDelimChar) {
					// PUSH MACRO START
					row[colIdx] = v;
					colIdx += 1;

					pos += 1;
					v = "";

					if (c === rowDelimChar) {
						rows.push(row);

						if (rows.length === chunkSize) {
							cb(rows);
							rows = [];

							if (_limit && ++numChunks === chunkLimit)
								return;
						}

						row = Array(numCols);
						colIdx = 0;
						pos += rowDelimLen - 1;
					}
					// PUSH MACRO END

					c = csvStr.charCodeAt(pos);
				}
				else
					inCol = 1;
			}

			if (inCol === 2) {
				while (1) {
					if (c === quoteChar) {
						let cNext  = csvStr.charCodeAt(pos + 1);

						if (cNext === quoteChar) {
							v += quote;
							pos += 2;
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
					colIdx += 1;

					pos += 1;
					v = "";

					if (c === rowDelimChar) {
						rows.push(row);

						if (rows.length === chunkSize) {
							cb(rows);
							rows = [];

							if (_limit && ++numChunks === chunkLimit)
								return;
						}

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
		cb(rows);
	}

	exports.parse = parse;
	exports.schema = schema;

	return exports;

})({});

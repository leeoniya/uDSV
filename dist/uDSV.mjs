/**
* Copyright (c) 2025, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* uDSV.js
* A small, fast CSV parser
* https://github.com/leeoniya/uDSV (v0.7.1)
*/

const comma = ',';
const quote = '"';
const tab   = '\t';
const pipe  = '|';
const semi  = ';';

const ISO8601 = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3,})?(?:Z|[-+]\d{2}:?\d{2}))?$/;
const BOOL_RE = /^(?:t(?:rue)?|f(?:alse)?|y(?:es)?|n(?:o)?|0|1)$/i;

const COL_DELIMS = [tab, pipe, semi, comma];

function stripBOM(str) {
	return str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
}

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

const toJSON = JSON.stringify;
const onlyStrEsc = v => typeof v === 'string' ? toJSON(v) : v;

function getValParseExpr(ci, col) {
	let { type, parse } = col;

	let rv = `r[${ci}]`;

	let parseExpr =
	    parse   !=  null      ? `c[${ci}].parse(${rv})`                             :
		type    === T_DATE    ? `new Date(${rv})`                                   :
		type    === T_JSON    ? `JSON.parse(${rv})`                                 :
		type    === T_NUMBER  ? `+${rv}`                                            :
		type[0] === T_BOOLEAN ? `${rv} === ${toJSON(type.slice(2))} ? true : false` :
		rv;

	let { repl } = col;

	let nanExpr   = repl.NaN   !== void 0 && type === T_NUMBER ? `${rv} === 'NaN' ? ${onlyStrEsc(repl.NaN)} : `                       : '';
	let nullExpr  = repl.null  !== void 0                      ? `${rv} === 'null' || ${rv} === 'NULL' ? ${onlyStrEsc(repl.null)} : ` : '';
	let emptyExpr = repl.empty !== void 0                      ? `${rv} === '' ? ${onlyStrEsc(repl.empty)} : `                        : '';

	return `${emptyExpr} ${nullExpr} ${nanExpr} ${parseExpr}`;
}

const segsRe = /\w+(?:\[|\]?[\.\[]?|$)/gm;

function genToTypedRow(cols, objs = false, deep = false) {
	let buf = '';

	if (objs && deep) {
		let tplObj = {};
		let colIdx = 0;

		let paths = cols.map(c => c.name.replace(/\.(\d+)\.?/gi, '[$1]'));

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

		buf = toJSON(tplObj).replace(/"¦(\d+)¦"/g, (m, ci) => getValParseExpr(+ci, cols[+ci]));
	}
	else {
		if (!objs && cols.every(c => c.type === T_STRING))
			buf = 'r';
		else {
			buf = objs ? '{' : '[';

			cols.forEach((col, ci) => {
				buf += objs ? `${toJSON(col.name)}:` : '';
				let parseVal = getValParseExpr(ci, col);
				buf += `${parseVal},`;
			});

			buf += objs ? '}' : ']';
		}
	}

	return new Function('c', `return r => (${buf});`)(cols);
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

	csvStr = stripBOM(csvStr);

	// will fail if header contains line breaks in quoted value
	// will fail if single line without line breaks
	const rowRE         = new RegExp(`(.*)(${rowDelim ?? '\r\n|\r|\n'})`);
	const firstRowMatch = csvStr.match(rowRE);
	const firstRowStr   = firstRowMatch[1];

	rowDelim ??= firstRowMatch[2];
	colDelim ??= COL_DELIMS.find(delim => firstRowStr.indexOf(delim) > -1) ?? comma;

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
	parse(csvStr, schema, 0, row => {
		firstRows.push(row);
		return firstRows.length < maxRows;
	}, true, _maxCols);

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

function initParser(schema) {
	let { skip, cols } = schema;

	let _toStr = null;
	let _toArr = null;
	let _toObj = null;
	let _toDeep = null;
	let _toObjS = null;

	let streamState = 0;
	let streamParse = null;
	let streamCb = null;
	let prevUnparsed = '';

	let buf = null;

	function reset() {
		streamState = 0;
		prevUnparsed = '';
		streamParse = streamCb = buf = null;
	}

	let accum    = (row, buf, add) => {
		add(buf, row);
		return true;
	};
	let initRows = () => [];
	let initCols = () => cols.map(c => []);
	let addRow  = (buf, row) => { buf.push(row); };
	let addCol  = new Function('buf', 'row', `
		${schema.cols.map((c, i) => 'buf[' + i + '].push(row[' + i + '])').join(';')};
	`);

	function gen(accInit, accAppend, genConvertRow) {
		let convertRow = null;

		return (csvStr, cb = accum) => {
			convertRow ??= genConvertRow();

			let _skip = buf == null ? skip : 0;

			buf ??= accInit();
			let out = buf;
			let withEOF = streamState === 0 || streamState === 2;

			let halted = false;

			if (Array.isArray(csvStr)) {
				for (let i = 0; i < csvStr.length; i++) {
					let row = csvStr[i];
					let res = cb(convertRow(row), out, accAppend);

					if (res === false) {
						halted = true;
						break;
					}
				}
			}
			else
				[prevUnparsed, halted] = parse(csvStr, schema, _skip, row => cb(convertRow(row), out, accAppend), withEOF);

			if (halted && streamState !== 0)
				reset();

			if (withEOF)
				buf = null;

			return out;
		};
	}

	const _toStrGen = () => {
		_toStr ??= row => row;
		return _toStr;	};

	const _toArrGen = () => {
		_toArr ??= genToTypedRow(cols, false, false);
		return _toArr;
	};

	const stringArrs = gen(initRows, addRow, _toStrGen);

	const stringObjs = gen(initRows, addRow, () => {
		_toObjS ??= genToTypedRow(cols.map(col => ({
			...col,
			type: 's',
			repl: {
				...col.repl,
				empty: void 0,
			}
		})), true, false);

		return _toObjS;
	});

	const typedArrs = gen(initRows, addRow, _toArrGen);

	const typedObjs = gen(initRows, addRow, () => {
		_toObj ??= genToTypedRow(cols, true, false);
		return _toObj;
	});

	const typedDeep = gen(initRows, addRow, () => {
		_toDeep ??= genToTypedRow(cols, true, true);
		return _toDeep;
	});

	const typedCols = gen(initCols, addCol, _toArrGen);

	const stringCols = gen(initCols, addCol, _toStrGen);

	return {
		schema,

		stringArrs,
		stringObjs,
		stringCols,

		typedArrs,
		typedObjs,
		typedDeep,
		typedCols,

		chunk(csvStr, parse = stringArrs, cb = accum) {
			streamParse ??= parse;
			streamCb    ??= cb;

			streamState = 1;
			streamParse(prevUnparsed + csvStr, streamCb);
		},
		end() {
			streamState = 2;
			let out = streamParse(prevUnparsed, streamCb);
			reset();
			return out;
		},
	};
}

// todo: allow schema to have col.skip: true
// _maxCols is cols estimated by simple delimiter detection and split()
// returns [unparsed tail, shouldHalt]
function parse(csvStr, schema, skip = 0, each = () => true, withEOF = true, _maxCols) {
	csvStr = stripBOM(csvStr);

	let {
		row:  rowDelim,
		col:  colDelim,
		encl: colEncl,
		esc:  escEncl,
		trim,
	} = schema;

	// is this cheap in WebKit/Mozilla, would simplify exit conditions
	// if (withEOF && !csvStr.endsWith(rowDelim))
	// 	csvStr += rowDelim;

	colEncl ??= csvStr.indexOf(quote) > -1 ? quote : ''; 	// TODO: detect single quotes?
	escEncl ??= colEncl;

	let replEsc = `${escEncl}${colEncl}`;

	let numCols = _maxCols ?? schema.cols.length;

	// uses a slower regexp path for schema probing
	let _probe = _maxCols != null;

	let rowDelimLen = rowDelim.length;
	let colDelimLen = colDelim.length;

	let colEnclChar  = colEncl.charCodeAt(0);
	let escEnclChar  = escEncl.charCodeAt(0);
	let rowDelimChar = rowDelim.charCodeAt(0);
	let colDelimChar = colDelim.charCodeAt(0);
	let spaceChar    = 32;

	let out = ['', false];

	let pos = 0;
	let endPos = csvStr.length - 1;
	let linePos = 0;

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

				if (--skip < 0) {
					if (each(row) === false) {
						// if caller indicates an early exit, we dont return the unparsed tail
						out[1] = true;
						return out;
					}
				}

				row = rowTpl.slice();
				colIdx = 0;
				filledColIdx = -1;
				pos = pos2 + rowDelimLen;
				linePos = pos;
			}
			else {
				// empty line
				if (colIdx === 0 && csvStr.charCodeAt(pos) === rowDelimChar) {
					pos += rowDelimLen;
					// TODO: callback here!
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
		}

		if (--skip < 0 && withEOF && colIdx === lastColIdx && filledColIdx > -1)
			each(row);

		out[0] = !withEOF ? csvStr.slice(linePos) : '';
		return out;
	}

	// should this be * to handle ,, ?
	const takeToCommaOrEOL = _probe ? new RegExp(`[^${colDelim}${rowDelim}]+`, 'my') : null;

	// 0 = no
	// 1 = unquoted
	// 2 = quoted
	let inCol = 0;

	let v = '';
	let c = 0;

	let pos0 = pos;

	while (pos <= endPos) {
		c = csvStr.charCodeAt(pos);

		if (inCol === 0) {
			if (c === colEnclChar) {
				inCol = 2;
				pos += 1;
				pos0 = pos;

				if (pos > endPos)
					break;

				c = csvStr.charCodeAt(pos);
			}
			else if (c === colDelimChar || c === rowDelimChar) {
				// PUSH MACRO START
				if (c === rowDelimChar && colIdx === 0) {
					pos += rowDelimLen;
					// TODO: callback here!
					continue;
				}

				row[colIdx] = v;
				filledColIdx = colIdx;
				colIdx += 1;

				pos += 1;
				v = '';

				if (c === rowDelimChar) {
					if (_probe && filledColIdx < lastColIdx && linePos === 0) {
						row.length = rowTpl.length = filledColIdx + 1;
						lastColIdx = filledColIdx;
					}

					if (--skip < 0) {
						if (each(row) === false) {
							// if caller indicates an early exit, we dont return the unparsed tail
							out[1] = true;
							return out;
						}
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
			let shouldRep = false;
			let posTo = 0;

			while (true) {
				if (c === colEnclChar) {
					if (colEnclChar === escEnclChar) {
						if (pos + 1 > endPos) { // TODO: test with chunk ending in closing ", even at EOL but not EOF
							posTo = pos;
							pos = endPos + 1;
							break;
						}

						let cNext = csvStr.charCodeAt(pos + 1);

						if (cNext === colEnclChar) {
							pos += 2;

							// MACRO START
							shouldRep = true;
							if (pos > endPos)
								break;
							c = csvStr.charCodeAt(pos);
							// MACRO END
						}
						else {
							inCol = 0;
							posTo = pos;
							pos += 1;
							break;
						}
					}
					else {
						let cPrev = csvStr.charCodeAt(pos - 1);

						if (cPrev === escEnclChar) {
							pos += 1;

							// MACRO START
							shouldRep = true;
							if (pos > endPos)
								break;
							c = csvStr.charCodeAt(pos);
							// MACRO END
						}
						else {
							inCol = 0;
							posTo = pos;
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

					pos = pos2;
					c = colEnclChar;
				}
			}

			if (inCol === 0 || pos > endPos) {
				v = shouldRep ?
					csvStr.slice(pos0, posTo).replaceAll(replEsc, colEncl) :
					csvStr.slice(pos0, posTo);
			}
		}
		else if (inCol === 1) {
			if (c === colDelimChar || c === rowDelimChar) {
				// PUSH MACRO START
				if (c === rowDelimChar && colIdx === 0) {
					pos += rowDelimLen;
					// TODO: callback here!
					continue;
				}

				row[colIdx] = v;
				filledColIdx = colIdx;
				colIdx += 1;

				pos += 1;
				v = '';

				if (c === rowDelimChar) {
					if (_probe && filledColIdx < lastColIdx && linePos === 0) {
						row.length = rowTpl.length = filledColIdx + 1;
						lastColIdx = filledColIdx;
					}

					if (--skip < 0) {
						if (each(row) === false) {
							// if caller indicates an early exit, we dont return the unparsed tail
							out[1] = true;
							return out;
						}
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
					v = m;
					pos += m.length;  // rowdelim when - 1
				}
				else {
					let pos2 = csvStr.indexOf(colIdx === lastColIdx ? rowDelim : colDelim, pos);

					if (pos2 === -1)
						pos2 = endPos + 1;

					let s = csvStr.slice(pos, pos2);
					v = trim ? s.trim() : s;
					pos = pos2;
				}
			}
		}
	}

	if (withEOF && colIdx === lastColIdx) {
		row[colIdx] = v;

		if (--skip < 0)
			each(row);

		inCol = 0;
	}

	let partial = !withEOF && (
		inCol !== 0 ||
		(
			filledColIdx === -1 ? v !== '' :  // partial first col OR
			filledColIdx < lastColIdx         // not all cols filled
		)
	);

	out[0] = partial ? csvStr.slice(linePos) : '';
	return out;
}

// const parsed = {
// 	format: '',
// 	data: []
// };

export { inferSchema, initParser };

import { initUnparser } from '../src/uDSV.mjs';

import { strict as assert } from 'node:assert';
import test from 'node:test';

test('fromArrs() & fromObjs()', (t) => {
	let date = new Date(1701653685845);

	let dataArrs = [
		['he"llo',     5, true,  [1, 2],       date, 'aaa 123'],
		['wor,ld',   NaN, false, {a: 1, b: 2}, null, 'aaa 123'],
		['he\nllo',    5, true,  [1, 2],       date, null],
		['hello',   null, false, {a: 1, b: 2}, date, 'aaa 123'],
		['world',     10, true,  null,         date, 'aaa 123'],
	];

	let dataObjs = dataArrs.map(row => ({
		a:         row[0],
		"b,":      row[1],
		c:         row[2],
		json:      row[3],
		date:      row[4],
		nice_strs: row[5],
	}));

	let schema = {
		row: '\n',
		col: ',',
		encl: '"',
		esc: '"',
		cols: [
			{
				name: 'a',
				type: 's',
			},
			{
				name: 'b,',
				type: 'n',
			},
			{
				name: 'c',
				type: 'b:true'
			},
			{
				name: 'json',
				type: 'j'
			},
			{
				name: 'date',
				type: 'd'
			},
			{
				name: 'nice_strs',
				type: 's',
			//	encl: false,
			},
		]
	};

	let up = initUnparser(schema);

	let expect = `
		a,"b,",c,json,date,nice_strs
		"he""llo",5,false,"[1,2]",2023-12-04T01:34:45.845Z,aaa 123
		"wor,ld",NaN,false,"{""a"":1,""b"":2}",,aaa 123
		"he\nllo",5,false,"[1,2]",2023-12-04T01:34:45.845Z,
		hello,,false,"{""a"":1,""b"":2}",2023-12-04T01:34:45.845Z,aaa 123
		world,10,false,,2023-12-04T01:34:45.845Z,aaa 123
	`.replace(/^\s+/gm, '');

    assert.deepEqual(up.fromArrs(dataArrs), expect);
	assert.deepEqual(up.fromObjs(dataObjs), expect);
});
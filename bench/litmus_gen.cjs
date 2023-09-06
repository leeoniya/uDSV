const fs = require('fs');

let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';

function randStr(length) {
  let s = '';

  for (; s.length < length; s += chars.charAt(Math.random() * 63 | 0));

  return s;
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let rows = 1e4;
let cols = 20;
let out = [];

for (let i = 0; i < rows; i++) {
  out.push(
    Array.from(
      { length: cols },
      () => randStr(randInt(3, 15))
    ).join(',')
  );
}

fs.writeFileSync(__dirname + '/data/litmus_strings.csv', out.join('\n'));

out = [];

for (let i = 0; i < rows; i++) {
  out.push(
    Array.from(
      { length: cols },
      () => i === 0 ? randStr(randInt(3, 15)) : randInt(-10_000, 10_000)
    ).join(',')
  );
}

fs.writeFileSync(__dirname + '/data/litmus_ints.csv', out.join('\n'));


out = [];

for (let i = 0; i < rows; i++) {
  out.push(
    Array.from(
      { length: cols },
      (v, j) => i === 0 || j % 2 === 0 ? `"${randStr(randInt(3, 15))}"` : `"${randInt(-10_000, 10_000)}"`
    ).join(',')
  );
}

fs.writeFileSync(__dirname + '/data/litmus_quoted.csv', out.join('\n'));

/*
// https://github.com/josdejong/csv42/tree/main/benchmark

{
  let len = 10_000;
  let testHuge = Array(len);

  testHuge[0] = `_type,name,description,city,street,latitude,longitude,speed,heading,"field with , delimiter","field with "" double quote"`;

  for (let i = 1; i < len; i++) {
    testHuge[i] = `item,Item ${i},Item ${i} description in text,Rotterdam,Main street,${(Math.random() * 100).toFixed(7)},${(Math.random() * 100).toFixed(7)},5.4,128.3,"value with , delimiter","value with "" double quote"`;
  }

  fs.writeFileSync('./csv42_flat_10k.csv', testHuge.join("\n"));
}

{
  let len = 10_000;
  let testHuge = Array(len);

  testHuge[0] = `_type,name,description,location.city,location.street,location.geo[0],location.geo[1],speed,heading,size[0],size[1],size[2],"field with , delimiter","field with "" double quote"`;

  for (let i = 1; i < len; i++) {
    testHuge[i] = `item,Item ${i},Item ${i} description in text,Rotterdam,Main street,${(Math.random() * 100).toFixed(7)},${(Math.random() * 100).toFixed(7)},5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"`;
  }

  fs.writeFileSync('./csv42_nested_10k.csv', testHuge.join("\n"));
}

{
  let len = 10_000;
  let testHuge = Array(len);

  testHuge[0] = `_type,name,description,location.city,location.street,location.geo.0,location.geo.1,speed,heading,size.0,size.1,size.2,"field with , delimiter","field with "" double quote"`;

  for (let i = 1; i < len; i++) {
    testHuge[i] = `item,Item ${i},Item ${i} description in text,Rotterdam,Main street,${(Math.random() * 100).toFixed(7)},${(Math.random() * 100).toFixed(7)},5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"`;
  }

  fs.writeFileSync('./csv42_nested_10k_dot.csv', testHuge.join("\n"));
}
*/

/*
// https://github.com/LeanyLabs/csv-parsers-benchmarks
// https://github.com/willfarrell/csv-benchmarks

let files = [
  {
    columns: 10,
    rows: 10_000,
    cycles: 20,
  },
  {
    columns: 100,
    rows: 10_000,
    cycles: 10,
  },
  {
    columns: 10,
    rows: 100_000,
    cycles: 10,
  },
  {
    columns: 100,
    rows: 100_000,
    cycles: 5,
  },
  {
    columns: 10,
    rows: 1_000_000,
    cycles: 5,
  },
];

function gen(quotes) {
  const wrapper = quotes ? '"' : ''
  const delimiter = quotes ? '","' : ','

  files.forEach(({columns, rows}) => {
    let buf = '';

    buf += wrapper + Array.from({ length: columns }, (_, x) => `col${x}`).join(delimiter) + wrapper + '\r\n';

    for (let y = 0; y < rows; y++) {
      buf += wrapper + Array.from({ length: columns }, (_, x) => `${x}x${y}`).join(delimiter) + wrapper + '\r\n';
    }

    fs.writeFileSync(`./bench/data/${columns}x${rows}_${quotes ? 'quoted' : 'slim'}.csv`, buf);
  });
}

gen(true);
gen(false);
*/
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
const fs = require('fs');

let len = 10_000;

{
  let testHuge = Array(len);

  testHuge[0] = `_type,name,description,city,street,latitude,longitude,speed,heading,"field with , delimiter","field with "" double quote"`;

  for (let i = 1; i < len; i++) {
    testHuge[i] = `item,Item ${i},Item ${i} description in text,Rotterdam,Main street,${(Math.random() * 100).toFixed(7)},${(Math.random() * 100).toFixed(7)},5.4,128.3,"value with , delimiter","value with "" double quote"`;
  }

  fs.writeFileSync('./csv42_flat_10k.csv', testHuge.join("\n"));
}

{
  let testHuge = Array(len);

  testHuge[0] = `_type,name,description,location.city,location.street,location.geo[0],location.geo[1],speed,heading,size[0],size[1],size[2],"field with , delimiter","field with "" double quote"`;

  for (let i = 1; i < len; i++) {
    testHuge[i] = `item,Item ${i},Item ${i} description in text,Rotterdam,Main street,${(Math.random() * 100).toFixed(7)},${(Math.random() * 100).toFixed(7)},5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"`;
  }

  fs.writeFileSync('./csv42_nested_10k.csv', testHuge.join("\n"));
}
*/
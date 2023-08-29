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
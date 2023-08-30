// node ./bench/run.cjs --dataPath=./bench/litmus_20c_10000r.csv --parserPath=./streaming/csv-parser.cjs
// node ./bench/run.cjs --dataPath=./demo/data/15x7.3k-some-quotes.csv --parserPath=./non-streaming/typed/uDSV-objs.cjs
// node ./bench/run.cjs --dataPath=./bench/data/litmus_ints.csv --parserPath=./non-streaming/untyped/d3-dsv.cjs

const argv = require('yargs-parser')(process.argv.slice(2));

const dataPath = argv.dataPath;
const parserMod = argv.parserPath;

const fs = require('fs');
const { bench } = require('./bench.cjs');

const Papa = require('papaparse'); // for output validation

const csvStr = fs.readFileSync(dataPath, 'utf8'); // only if non stream mode?

const expected = Papa.parse(csvStr).data;

const parser = require(parserMod);

function addType(types, v) {
  if (v === null)
    types.add('null');
  else if (typeof v === 'string')
    types.add('string');
  else if (v === Infinity || v === -Infinity)
    types.add('Infinity');
  else if (Number.isNaN(v))
    types.add('NaN');
  else if (typeof v === 'number')
    types.add('number');
  else if (typeof v === 'boolean')
    types.add('boolean');
  else if (Array.isArray(v))
    types.add('array');
  else if (v instanceof Date)
    types.add('date');
  else if (typeof v === 'object')
    types.add('object');
}

(async () => {
  let out = {
    error: null,
    rows: null,
    cols: null,
    gmean: null,
    sample: null,
    types: null,
    rss: null,
  };

  try {
    const parse = await parser.load();

    // console.time('test-parse');
    let result = await parse(csvStr, dataPath);
    // console.timeEnd('test-parse');
    // process.exit();

    let numRows;
    let numCols;
    let sample;
    let types;

    if (result._isCols) {
      numRows = Object.keys(result[0]).length;
      numCols = result.length;
      sample = result.map(c => c.slice(0, 10));

      types = new Set();

      for (let c of result) {
        for (let v of c.slice(1)) {
          addType(types, v);
        }
      }
    } else {
      numRows = result.length;
      numCols = Object.keys(result[0]).length;
      // limit to 100c x 10r
      sample = result.slice(0, 10).map(r => {
        if (Array.isArray(r))
          return r.slice(0, 100);
        else {
          let o = {};

          let i = 0;
          for (let k in r) {
            o[k] = r[k];
            if (++i == 100)
              break;
          }

          return o;
        }
      });

      types = new Set();

      for (let r of sample.slice(1)) {
        for (let v of Object.values(r)) {
          addType(types, v);
        }
      }
    }

    // TODO: remove tolerance
    if (numRows < expected.length - 2 || numRows > expected.length)
      out.error = `ERR: Wrong row count, expected: ${expected.length}, actual: ${numRows}.`;
    else if (numCols !== Object.keys(expected[0]).length)
      out.error = `ERR: Wrong col count, expected: ${Object.keys(expected[0]).length}, actual: ${numCols}.`;
    else {
      const { gmean, rss } = await bench(csvStr, dataPath, parse);
      out.rows = numRows;
      out.cols = numCols;
      out.sample = sample;

      out.gmean = gmean;
      out.types = [...types].sort();
      out.rss = rss;
    }
  } catch (e) {
    out.error = `ERR: ${e.message}`;
  } finally {
    console.log(JSON.stringify(out));
    parser.unload?.();
  }
})();
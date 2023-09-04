// node ./bench/runone.cjs --parser=./non-streaming/typed/uDSV-arrs.cjs --data=./demo/data/15x7.3k-some-quotes.csv

const BENCH_DUR = 3_000;

const argv = require('yargs-parser')(process.argv.slice(2));

const dataPath = argv.data;
const parserMod = argv.parser;
const verify = !!(argv.verify ?? true);

const fs = require('fs');

const Papa = require('papaparse'); // for output validation

const csvStr = verify ? fs.readFileSync(dataPath, 'utf8') : ''; // only if non stream mode?

const expected = verify ? Papa.parse(csvStr).data : [];

const baselineRSS = process.memoryUsage().rss;

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

function geoMean(arr) {
	let logSum = arr.reduce((acc, val) => acc + Math.log(val), 0);
	return Math.exp(logSum / arr.length);
}

const sleep = ms => new Promise(resolve => setImmediate(resolve));

async function bench(csvStr, path, parse) {
  let durs = [];
  let rss = [];

  let doneProm = new Promise((resolve, reject) => {
    (async () => {
      let cycleStart = performance.now();

      while (true) {
        let st = performance.now();

        await parse(csvStr, path);
        await sleep(); // setImmediate (GC)

        let en = performance.now();

        durs.push(en - st);
        rss.push(process.memoryUsage.rss());

        if (en - cycleStart >= BENCH_DUR) {
          resolve({
            gmean: geoMean(durs),
            rss: Math.max(...rss),
          });

          break;
        }
      }
    })();
  });

  return doneProm;
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
    rssBase: null,
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
      let countRows = parser.countRows ?? (result => Object.keys(result[0] ?? []).length);
      let countCols = parser.countCols ?? (result => result.length);
      let getSample = parser.getSample ?? (result.map(c => c.slice(0, 10)));
      let getTypes  = parser.getTypes  ?? (result => {
        types = new Set();

        for (let c of result) {
          for (let v of c.slice(1)) {
            addType(types, v);
          }
        }

        return types;
      });

      numRows = countRows(result);
      numCols = countCols(result);
      sample  = getSample(result);
      types   = getTypes(result);
    }
    else {
      let countRows = parser.countRows ?? (result => result.length);
      let countCols = parser.countCols ?? (result => Object.keys(result[0] ?? []).length);
      let getSample = parser.getSample ?? (result => (
        // limit to 100c x 10r
        result.slice(0, 10).map(r => {
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
        }
      )));
      let getTypes = parser.getTypes  ?? (result => {
        types = new Set();

        for (let r of sample.slice(1)) {
          for (let v of Object.values(r)) {
            addType(types, v);
          }
        }

        return types;
      });

      numRows = countRows(result);
      numCols = countCols(result);
      sample  = getSample(result);
      types   = getTypes(result);
    }

    // TODO: remove tolerance
    if (verify && (numRows < expected.length - 2 || numRows > expected.length))
      out.error = `Wrong row count! Expected: ${expected.length}, Actual: ${numRows}`;
    else if (verify && (numCols !== Object.keys(expected[0]).length))
      out.error = `Wrong col count! Expected: ${Object.keys(expected[0]).length}, Actual: ${numCols}`;
    else {
      const { gmean, rss } = await bench(csvStr, dataPath, parse);
      out.rows = numRows;
      out.cols = numCols;
      out.sample = sample;

      out.gmean = gmean;
      out.types = [...types].sort();
      out.rss = rss;
      out.rssBase = baselineRSS;
    }
  } catch (e) {
    out.error = e.message;
  } finally {
    console.log(JSON.stringify(out));
    parser.unload?.();
  }
})();
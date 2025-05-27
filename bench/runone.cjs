// node ./bench/runone.cjs --parser=./non-streaming/typed/uDSV-arrs.cjs --data=./demo/data/15x7.3k-some-quotes.csv
// bun --inspect run ./bench/runone.cjs --data=./bench/data/data-large2.csv --parser=./non-streaming/untyped/PapaParse.cjs --verify=0 --wait=5000 --cycles=1

const BENCH_DUR = 3_000;

const argv = require('yargs-parser')(process.argv.slice(2));

const dataPath = argv.data;
const parserMod = argv.parser;
const verify = !!(argv.verify ?? true);
const wait = Number(argv.wait ?? 0);
const cycles = Number(argv.cycles ?? Infinity);

const fs = require('fs');

const csvStr = !parserMod.includes('/streaming/non-retained') ? fs.readFileSync(dataPath, 'utf8') : ''; // only if non stream mode?

const expectedAll = JSON.parse(fs.readFileSync('./bench/expected.json'));
const fileName = dataPath.slice(dataPath.lastIndexOf('/') + 1);
const {
  rows: expectedRows,
  cols: expectedCols,
} = expectedAll[fileName];

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
const pauseFor = ms => new Promise(resolve => setTimeout(resolve, ms));

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

        if (en - cycleStart >= BENCH_DUR || durs.length == cycles) {
          resolve({
            gmean: geoMean(durs),
            // largest single positive alloc
            rss: rss.reduce((max, v, i) => i === 0 ? 0 : Math.max(max, v - rss[i-1]), 0),
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

    await pauseFor(wait);

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
      let getSample = parser.getSample ?? (result => result.map(c => c.slice(0, 10)));
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
    if (verify && (numRows < expectedRows - 2 || numRows > expectedRows))
      out.error = `Wrong row count! Expected: ${expectedRows}, Actual: ${numRows}`;
    else if (verify && (numCols !== expectedCols))
      out.error = `Wrong col count! Expected: ${expectedCols}, Actual: ${numCols}`;
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
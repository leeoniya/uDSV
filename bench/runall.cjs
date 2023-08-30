// node ./bench/runall.cjs
// node --max-old-space-size=1536 ./bench/runall.cjs

const CYCLE_DELAY = 5_000;

const baselineRSS = process.memoryUsage().rss;

const fs = require('node:fs');
const { genTable } = require('./table.cjs');

const { spawnSync } = require('node:child_process');

// const Papa = require('papaparse'); // for output validation

// const fmtBytes = Intl.NumberFormat("en", {
//   notation: "compact",
//   style: "unit",
//   unit: "byte",
//   unitDisplay: "narrow",
// }).format;

const fmtNum3 = new Intl.NumberFormat('en-US', {
  notation: "compact",
  compactDisplay: "short",
  maximumSignificantDigits: 3,
}).format;

const fmtNum2 = new Intl.NumberFormat('en-US', {
  notation: "compact",
  compactDisplay: "short",
  maximumSignificantDigits: 2,
}).format;

// https://stackoverflow.com/a/18650828
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const DATA_EARTHQUAKES  = './bench/data/large-dataset.csv';
const DATA_ZIPCODES     = './bench/data/uszips.csv';
const DATA_SENSORS      = './bench/data/data-large.csv';
const DATA_SENSORS_1HDR = './bench/data/data-large2.csv';
const DATA_HOUSE_PRICES = './bench/data/HPI_master.csv';

let synthData = [
  // './bench/data/test.csv',

  './bench/data/litmus_strings.csv',
  './bench/data/litmus_ints.csv',
  './bench/data/litmus_quoted.csv',

  './bench/data/csv42_flat_10k.csv',
  './bench/data/csv42_nested_10k.csv',
];

let realData = [
  // DATA_EARTHQUAKES,
  DATA_ZIPCODES,
  // DATA_SENSORS,
  // DATA_SENSORS_1HDR,
  // DATA_HOUSE_PRICES,
];

let dataPaths = [
  // ...synthData,
  ...realData,
];

let typedParsers = [
  './non-streaming/typed/uDSV-arrs.cjs',
  // './non-streaming/typed/uDSV-objs.cjs',
  // './non-streaming/typed/uDSV-cols.cjs',

  './non-streaming/typed/csv-simple-parser-arrs.cjs',
  // './non-streaming/typed/csv-simple-parser-objs.cjs',

  './non-streaming/typed/d3-dsv-arrs.cjs',
  // './non-streaming/typed/d3-dsv-objs.cjs',

  './non-streaming/typed/comma-separated-values.cjs',
  './non-streaming/typed/csv42.cjs',
  './non-streaming/typed/achilles-csv-parser.cjs',

  './non-streaming/typed/PapaParse-arrs.cjs',
  // './non-streaming/typed/PapaParse-objs.cjs',

  './non-streaming/typed/csv-js.cjs',
  './non-streaming/typed/vanillaes-csv.cjs',
  './non-streaming/typed/SheetJS.cjs',
  './non-streaming/typed/CSVtoJSON.cjs',
  './non-streaming/typed/csv-parser.cjs',
  './non-streaming/typed/csv-parse.cjs',

  // './non-streaming/typed/node-csvtojson.cjs',      // doesnt work without explicit column typing?

  // './non-streaming/typed/PapaParse-arrs-manual.cjs',
  // './non-streaming/typed/but-csv-manual.cjs',

  // './non-streaming/typed/node-csvtojson-deep.cjs', // doesnt work without explicit column typing?
  // './non-streaming/typed/csv42-deep.cjs',
  // './non-streaming/typed/uDSV-deep.cjs',
  // './non-streaming/typed/PapaParse-deep.cjs',      // invalid, does not flatten more than 2 levels
];

let untypedParsers = [
  './non-streaming/untyped/uDSV.cjs',
  './non-streaming/untyped/PapaParse.cjs',
  './non-streaming/untyped/d3-dsv.cjs',
  './non-streaming/untyped/but-csv.cjs',
  './non-streaming/untyped/csv-simple-parser.cjs',
  './non-streaming/untyped/node-csvtojson.cjs',
  './non-streaming/untyped/SheetJS.cjs',
  './non-streaming/untyped/comma-separated-values.cjs',
  './non-streaming/untyped/achilles-csv-parser.cjs',
  './non-streaming/untyped/vanillaes-csv.cjs',
  './non-streaming/untyped/CSVtoJSON.cjs',
  './non-streaming/untyped/ts-csv.cjs',
  './non-streaming/untyped/csv42.cjs',
  './non-streaming/untyped/csv-js.cjs',
  './non-streaming/untyped/csv-parser.cjs',
  './non-streaming/untyped/csv-parse.cjs',
  './non-streaming/untyped/jquery-csv.cjs',
  './non-streaming/untyped/fast-csv.cjs',
  './non-streaming/untyped/utils-dsv-base-parse.cjs',

  // TODO: https://github.com/amin2312/ACsv/tree/main/release/js
  // TODO: https://github.com/mrodrig/json-2-csv
  // TODO: https://www.npmjs.com/package/datalib
];

let streamingParsers = [
  './streaming/untyped/uDSV.cjs',
  './streaming/untyped/PapaParse.cjs',
  './streaming/untyped/node-csvtojson.cjs',
  './streaming/untyped/csv-parser.cjs',
  './streaming/untyped/ya-csv.cjs',
  './streaming/untyped/dekkai.cjs',
  './streaming/untyped/utils-dsv-base-parse.cjs',
];

let parserPaths = [
  // ...untypedParsers,
  ...typedParsers,
  // ...streamingParsers,
];

let bin = process.argv0;

let results = [];

async function go(parserPath, dataPath, dataSize) {
  let cmd = bin === 'bun' ? ['run'] : [];

  let dataSizeMiB = dataSize / 1024 / 1024;

  let result = spawnSync(bin, cmd.concat([
    // `--max-old-space-size=8192`,
    './bench/runone.cjs',
    `--data=${dataPath}`,
    `--parser=${parserPath}`,
  ]));

  if (result.status !== 0)
    console.error(result.stderr.toString());
  else {
    const parserName = require(parserPath).name;

    let res = result.stdout.toString().trim();

    try {
      let r = JSON.parse(res);

      results.push({
        name: parserName,
        ...r,
        rss: r.rss == null ? null : r.rss - baselineRSS,
      });
    } catch (e) {
      console.log(res);
      return;
    }

    results.sort((a, b) => (a.gmean ?? 1e6) - (b.gmean ?? 1e6));

    let minGMean = Infinity;
    let maxRSS = -Infinity;
    results.forEach(({ gmean, rss, error }, i) => {
      if (error == null) {
        if (gmean < minGMean) {
          minGMean = gmean;
        }

        if (rss > maxRSS) {
          maxRSS = rss;
        }
      }
    });

    const blocksMBPS = 50;
    const blocksRSS = 30;

    let { cols, rows } = results.find(r => r.rows != null) ?? { cols: 0, rows: 0 };

    let dataHeader = `${dataPath.split('/').pop()} (${fmtNum2(dataSizeMiB)} MB, ${fmtNum2(cols)} cols x ${fmtNum2(rows)} rows)`;
    let rssHeader = `RSS above ${formatBytes(baselineRSS, 0)} baseline (MiB)`;

    let tableRows = results.map(({ name, gmean, rows, sample, types, error, rss }) => {
      if (error != null) {
        return {
          "Name":   name,
          // "Ops/s":  '---',
          "Rows/s": '---',
          "Throughput (MiB/s)": '---',
          [rssHeader]: '---',
          "Types": '---',
          "Sample": error,
        };
      }

      let pctRSS = rss / maxRSS;
      let pctGMean = minGMean / gmean;
      let opsPerSecGmean = 1e3 / gmean;

      let mbps = opsPerSecGmean * dataSizeMiB;

      return {
        "Name":   name,
        // "Ops/s":  fmtNum3(opsPerSecGmean),
        "Rows/s": fmtNum3(opsPerSecGmean * rows),
        "Throughput (MiB/s)": "░".repeat(Math.ceil(blocksMBPS * pctGMean))  + ' ' + fmtNum3(mbps),
        [rssHeader]:          "░".repeat(Math.ceil(blocksRSS  * pctRSS))    + ' ' + fmtNum3(rss / 1024 / 1024),
        "Types": types.join(),
        "Sample": JSON.stringify(sample.slice(1)).slice(0, 50),
      };
    });

    let table = genTable(tableRows, dataHeader);
    console.clear();
    console.log(table);
  }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  try {
    for (let dataPath of dataPaths) {
      results = [];

      const fileSize = fs.statSync(dataPath).size;
      // const expected = Papa.parse(csvStr).data;

      for (let parserPath of parserPaths) {
        await go(parserPath, dataPath, fileSize);
        await sleep(CYCLE_DELAY);
      }
    }
  } catch (spawnErr) {
    console.error(spawnErr);
  }
})();
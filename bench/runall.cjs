// node ./bench/runall.cjs
// node --max-old-space-size=1536 ./bench/runall.cjs

const CYCLE_DELAY = 10_000;

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
const DATA_AIRPORTS2    = './bench/data/Airports2.csv';

let synthData = [
  // './bench/data/test.csv',

  './bench/data/litmus_strings.csv',
  './bench/data/litmus_ints.csv',
  './bench/data/litmus_quoted.csv',

  // https://github.com/josdejong/csv42/tree/main/benchmark
  // './bench/data/csv42_flat_10k.csv',
  // './bench/data/csv42_nested_10k.csv',

  // https://github.com/willfarrell/csv-benchmarks
  // './bench/data/10x10000_slim.csv',
  // './bench/data/10x100000_slim.csv',
  // './bench/data/100x100000_slim.csv',
  // './bench/data/10x100000_quoted.csv',
  // './bench/data/100x100000_quoted.csv',
];

let realData = [
  // DATA_SENSORS_1HDR,
  DATA_ZIPCODES,
  // DATA_HOUSE_PRICES,
  // DATA_EARTHQUAKES,
  // DATA_AIRPORTS2,
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

  './non-streaming/typed/csv-rex.cjs',
  './non-streaming/typed/comma-separated-values.cjs',
  './non-streaming/typed/csv42.cjs',
  './non-streaming/typed/achilles-csv-parser.cjs',

  './non-streaming/typed/PapaParse-arrs.cjs',
  // './non-streaming/typed/PapaParse-objs.cjs',

  './non-streaming/typed/dekkai.cjs',

  './non-streaming/typed/csv-js.cjs',
  './non-streaming/typed/vanillaes-csv.cjs',
  './non-streaming/typed/SheetJS.cjs',
  './non-streaming/typed/CSVtoJSON.cjs',
  './non-streaming/typed/csv-parser.cjs',
  './non-streaming/typed/csv-parse.cjs',

  // './non-streaming/typed/node-csvtojson.cjs',      // doesnt work without explicit column typing?

  // './non-streaming/typed/PapaParse-arrs-manual.cjs',
  // './non-streaming/typed/but-csv-manual.cjs',
];

let typedDeepParsers = [
  './non-streaming/typed/uDSV-deep.cjs',
  './non-streaming/typed/csv42-deep.cjs',
  // './non-streaming/typed/node-csvtojson-deep.cjs', // doesnt work without explicit column typing?
  // './non-streaming/typed/PapaParse-deep.cjs',      // invalid, does not flatten more than 2 levels
];

let untypedParsers = [
  // './non-streaming/untyped/string-split.cjs',

  './non-streaming/untyped/uDSV.cjs',
  './non-streaming/untyped/csv-simple-parser.cjs',

  './non-streaming/untyped/PapaParse.cjs',
  // './non-streaming/untyped/PapaParse-objs.cjs',

  './non-streaming/untyped/ACsv.cjs',
  './non-streaming/untyped/d3-dsv.cjs',
  './non-streaming/untyped/csv-rex.cjs',
  './non-streaming/untyped/but-csv.cjs',
  './non-streaming/untyped/node-csvtojson.cjs',
  './non-streaming/untyped/comma-separated-values.cjs',
  './non-streaming/untyped/achilles-csv-parser.cjs',

  './non-streaming/untyped/dekkai.cjs',
  // './non-streaming/untyped/dekkai-native.cjs',
  // './non-streaming/untyped/dekkai-native-row-access.cjs',
  // './non-streaming/untyped/dekkai-native-value-access.cjs',

  './non-streaming/untyped/SheetJS.cjs',
  // './non-streaming/untyped/SheetJS-native.cjs',

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

  // './non-streaming/untyped/json-2-csv.cjs',
];

let streamingParsers = [
  './streaming/untyped/retained/uDSV.cjs',
  './streaming/untyped/retained/PapaParse.cjs',
  './streaming/untyped/retained/node-csvtojson.cjs',
  './streaming/untyped/retained/csv-rex.cjs',
  './streaming/untyped/retained/csv-parser.cjs',
  './streaming/untyped/retained/ya-csv.cjs',
  './streaming/untyped/retained/dekkai.cjs',
  './streaming/untyped/retained/utils-dsv-base-parse.cjs',

  // only use with litmus_ints.csv or Ariports2.csv numeric dataset, since these sum the 6th column
  // './streaming/untyped/non-retained/uDSV.cjs',
  // './streaming/untyped/non-retained/PapaParse.cjs',
  // './streaming/untyped/non-retained/dekkai.cjs',
];

let parserPaths = [
  ...untypedParsers,
  // ...typedParsers,
  // ...typedDeepParsers,
  // ...streamingParsers,
];

let bin = process.argv0;

let results = [];

async function go(parserPath, dataPath, dataSize) {
  let cmd = bin === 'bun' ? ['run'] : [];

  let dataSizeMiB = dataSize / 1024 / 1024;

  let verify = parserPath.includes('non-retained') || parserPath.includes('deep') ? 0 : 1;

  let result = spawnSync(bin, cmd.concat([
    // `--max-old-space-size=8192`,
    './bench/runone.cjs',
    `--data=${dataPath}`,
    `--parser=${parserPath}`,
    `--verify=${verify}`
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
        rss: r.rss == null ? null : r.rss - r.rssBase,
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

    const blocksMBPS = 55;
    const blocksRSS = 27;

    let { cols, rows } = results.find(r => r.rows != null) ?? { cols: 0, rows: 0 };

    let dataHeader = `${dataPath.split('/').pop()} (${fmtNum2(dataSizeMiB)} MB, ${fmtNum2(cols)} cols x ${fmtNum2(rows)} rows)`;
    let rssHeader = `RSS above ${formatBytes(results[0].rssBase, 0)} baseline (MiB)`;

    let tableRows = results.map(({ name, gmean, rows, sample, types, error, rss }) => {
      if (error != null) {
        return {
          "Name":   name,
          // "Ops/s":  '---',
          "Rows/s": '---',
          "Throughput (MiB/s)": error.slice(0, 59),
          [rssHeader]: '---',
          "Types": '---',
          "Sample": '---',
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
function geoMean(arr) {
	let logSum = arr.reduce((acc, val) => acc + Math.log(val), 0);
	return Math.exp(logSum / arr.length);
}

const sleep = ms => new Promise(resolve => setImmediate(resolve));

async function bench(csvStr, path, parse) {
  // bench should last 3s
  let targTotal = 3_000;

  let durs = [];
  let rss = [];
  // let allocs = [];

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

        if (en - cycleStart >= targTotal) {
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

exports.bench = bench;
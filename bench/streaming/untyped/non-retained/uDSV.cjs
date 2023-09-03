const fs = require('fs');

module.exports = {
  name: 'uDSV (file, sum)', // fs.createReadStream
  repo: 'https://github.com/leeoniya/uDSV',
  load: async () => {
    const { inferSchema, initParser } = await import('../../../../dist/uDSV.cjs.js');

    return (csvStr, path) => new Promise(res => {
      const readableStream = fs.createReadStream(path);

      let p = null;
      let sum = 0;

      let reducer = (rows) => {
        for (let i = 0; i < rows.length; i++) {
          sum += +rows[i][6];
        }
      };

      readableStream.on('data', (chunk) => {
        let strChunk = chunk.toString();
        p ??= initParser(inferSchema(strChunk, { encl: '"' }));
        p.chunk(strChunk, p.stringArrs, reducer);
      });

      readableStream.on('end', () => {
        p.end();
        res([[sum],[sum]]);
      });
    });
  },
};

/*
// slightly faster, but longer variant...

module.exports = {
  name: 'uDSV (file)', // fs.createReadStream
  repo: 'https://github.com/leeoniya/uDSV',
  load: async () => {
    const { inferSchema, initParser } = await import('../../../dist/uDSV.cjs.js');

    // node stream chunks are always 64K :(
    // https://github.com/nodejs/node/issues/41611
    // ...so we accumulate them until 2MB to reduce partial tail re-parses of each 64KB chunk
    // the boost is 94 MiB/s -> 104 MiB/s
    let CHONK_SIZE = 2 * 1024 * 1024;

    return (csvStr, path) => new Promise(res => {
      const readableStream = fs.createReadStream(path);

      let p = null;
      let chonk = '';

      readableStream.on('data', (chunk) => {
        chonk += chunk.toString();

        if (chonk.length >= CHONK_SIZE) {
          p ??= initParser(inferSchema(chonk, { encl: '"' }));
          p.chunk(chonk, p.stringArrs);
          chonk = '';
        }
      });

      readableStream.on('end', () => {
        if (chonk.length > 0) {
          p.chunk(chonk, p.stringArrs);
          chonk = '';
        }

        let rows = p.end();
        res(rows);
      });
    });
  },
};
*/
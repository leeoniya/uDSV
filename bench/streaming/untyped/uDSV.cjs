const fs = require('fs');

module.exports = {
  name: 'uDSV (file)', // fs.createReadStream
  repo: 'https://github.com/leeoniya/uDSV',
  load: async () => {
    const { inferSchema, initParser } = await import('../../dist/uDSV.cjs.js');

    return (csvStr, path) => new Promise(res => {
      const readableStream = fs.createReadStream(path);

      let p = null;

      readableStream.on('data', (chunk) => {
        let strChunk = chunk.toString();
        p ??= initParser(inferSchema(strChunk, null, null, '"'));
        p.chunk(strChunk, p.stringArrs);
      });

      readableStream.on('end', () => {
        let rows = p.end();
        res(rows);
      });
    });
  },
};
const fs = require('fs');

module.exports = {
  name: 'utils-dsv-base-parse (stream)',
  repo: 'https://github.com/stdlib-js/utils-dsv-base-parse',
  load: async () => {
    let { default: Parser } = await import('@stdlib/utils-dsv-base-parse');

    return (csvStr, path) => new Promise((res, rej) => {
      const readableStream = fs.createReadStream(path);

      const parser = new Parser({
        newline: '\n',
        // onColumn(field, row, col) {},
        onRow(record, row, ncols) {
          rows.push(record);
        }
      });

      let rows = [];

      readableStream.on('data', (chunk) => {
        let strChunk = chunk.toString();
        try {
          parser.next(strChunk);
        } catch (e) {
          rej(e);
          parser.close();
        }
      });

      readableStream.on('end', () => {
        parser.close();
        res(rows);
      });
    });
  },
};
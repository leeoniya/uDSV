const fs = require('fs');

module.exports = {
  name: '@stdlib/utils-dsv-base-parse (file)',
  repo: 'https://github.com/stdlib-js/utils-dsv-base-parse',
  load: async () => {
    let { default: Parser } = await import('@stdlib/utils-dsv-base-parse');

    return (csvStr, path) => new Promise(res => {
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
        parser.next(strChunk);
      });

      readableStream.on('end', () => {
        parser.close();
        res(rows);
      });
    });
  },
};
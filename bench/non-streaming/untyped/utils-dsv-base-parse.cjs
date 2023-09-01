module.exports = {
  name: 'utils-dsv-base-parse',
  repo: 'https://github.com/stdlib-js/utils-dsv-base-parse',
  load: async () => {
    let { default: Parser } = await import('@stdlib/utils-dsv-base-parse');

    return (csvStr, path) => new Promise(res => {
      let rows = [];

      const parser = new Parser({
        newline: '\n',
        // onColumn(field, row, col) {},
        onRow(record, row, ncols) {
          rows.push(record);
        }
      });

      parser.next(csvStr).close();
      res(rows);
    });
  },
};
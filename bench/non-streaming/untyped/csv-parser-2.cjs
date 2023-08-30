module.exports = {
  name: 'debitoor/csv-parser',
  repo: 'https://github.com/debitoor/csv-parser',
  load: async () => {
    const { default: parser } = await import('csv-parser-2');

    return (csvStr, path) => new Promise(res => {
      let rows = parser(Buffer.from(csvStr)).rows;
      res(rows);
    });
  }
};
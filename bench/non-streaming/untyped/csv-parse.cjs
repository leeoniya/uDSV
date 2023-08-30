module.exports = {
  name: 'csv-parse/sync',
  repo: 'https://csv.js.org/parse/',
  repo: 'https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/',
  load: async () => {
    const csvParse = await import('csv-parse/sync');

    return (csvStr, path) => new Promise(res => {
      let rows = csvParse.parse(csvStr, {});
      res(rows);
    });
  }
};
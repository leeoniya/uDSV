module.exports = {
  name: 'csv-parse/sync typed []',
  repo: 'https://csv.js.org/parse/',
  repo: 'https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/',
  load: async () => {
    const csvParse = await import('csv-parse/sync');

    return (csvStr, path) => new Promise(res => {
      let rows = csvParse.parse(csvStr, {
        // cast: function (value, context) {
        //   // You can return any value
        //   if (context.index === 0) {
        //     // Such as a string
        //     return `${value}T05:00:00.000Z`;
        //   } else {
        //     // Or the `context` object literal
        //     return context;
        //   }
        // },
        cast: true,
        castDate: true,
      });
      res(rows);
    });
  }
};
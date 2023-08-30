module.exports = {
  name: 'csv-parser (neat-csv)',
  repo: 'https://github.com/mafintosh/csv-parser',
  repo: 'https://github.com/sindresorhus/neat-csv', // wrapper for https://github.com/mafintosh/csv-parser
  load: async () => {
    const { default: neatCsv } = await import('neat-csv');

    return (csvStr, path) => new Promise(res => {
      neatCsv(csvStr, { strict: true }).then(rows => {
        res(rows);
      });
    });
  },
};
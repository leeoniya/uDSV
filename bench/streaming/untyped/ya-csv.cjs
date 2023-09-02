module.exports = {
  name: 'ya-csv (file)',
  repo: 'https://github.com/koles/ya-csv',
  load: async () => {
    const yaCsv = require('ya-csv');

    return (csvStr, path) => new Promise((res, rej) => {
      const reader = yaCsv.createCsvFileReader(path);
      const rows = [];

      reader.addListener('error', (e) => {
        rej(e);
      });

      reader.addListener('data', data => {
        rows.push(data);
      });

      reader.addListener('end', () => {
        res(rows);
      });
    });
  },
};
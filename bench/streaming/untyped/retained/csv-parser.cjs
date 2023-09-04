const fs = require('fs');

module.exports = {
  name: 'csv-parser (stream)',
  repo: 'https://github.com/mafintosh/csv-parser',
  load: async () => {
    const { default: csvParser } = await import('csv-parser');

    return (csvStr, path) => new Promise(res => {
      const rows = [];

      fs.createReadStream(path)
        .pipe(csvParser({ strict: true }))
        .on('data', (data) => {
          rows.push(data);
        })
        .on('end', () => {
          res(rows);
        });
    });
  },
};
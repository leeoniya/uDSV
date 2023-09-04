const fs = require('fs');

module.exports = {
  name: 'node-csvtojson (stream)',
  repo: 'https://github.com/Keyang/csvbench',
  repo: 'https://github.com/Keyang/node-csvtojson',
  load: async () => {
    const { default: csvToJson } = await import('csvtojson');

    return (csvStr, path) => {

      return new Promise((res) => {
        let rows = [];

        const readStream = fs.createReadStream(path);
        const converter = csvToJson({ output: "csv", noheader: true }, { objectMode: true });

        converter.on('data', row => {
          rows.push(row);
        });

        converter.on('done', () => {
          res(rows);
        })

        readStream.pipe(converter);
      });
    };
  },
};
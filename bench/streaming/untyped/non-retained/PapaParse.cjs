const fs = require('fs');

module.exports = {
  name: 'PapaParse (stream, sum)',
  repo: 'https://github.com/mholt/PapaParse',
  load: async () => {
    const { default: Papa } = await import('papaparse');

    return (csvStr, path) => new Promise(res => {
      const file = fs.createReadStream(path);
      let sum = 0;

      let chunkNum = 0;

      Papa.parse(file, {
        // chunkSize: 1024 * 1024,
        chunk: (result) => {
          let rows = result.data;

          for (let i = chunkNum++ === 0 ? 1 : 0; i < rows.length; i++) {
            sum += +rows[i][6];
          }
        },
        complete: (results, file) => {
          res([[sum],[sum]]);
        }
      });
    });
  },
};
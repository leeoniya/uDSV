const fs = require('fs');

module.exports = {
  name: 'PapaParse (stream)',
  repo: 'https://github.com/mholt/PapaParse',
  load: async () => {
    const { default: Papa } = await import('papaparse');

    return (csvStr, path) => new Promise(res => {
      const file = fs.createReadStream(path);

      let rows = [];

      Papa.parse(file, {
        // chunkSize: 1024 * 1024,
        chunk: (result) => {
          rows.push(...result.data);
        },
        complete: (results, file) => {
          res(rows);
        }
      });
    });
  },
};
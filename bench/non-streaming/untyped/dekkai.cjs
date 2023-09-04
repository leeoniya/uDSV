const fs = require('fs');

module.exports = {
  name: 'dekkai',
  repo: 'https://github.com/darionco/dekkai',
  load: async () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    return (csvStr, path) => new Promise(res => {
      dekkai.init(1).then(async () => {
        const file = fs.openSync(path);

        let table = await dekkai.tableFromLocalFile(file);

        const rows = [];

        // rows.push(table.mHeader.map(h => h.name));

        await table.forEach(row => {
          let rowArr = [];
          row.forEach(val => {
            rowArr.push(val);
          });
          rows.push(rowArr);
        });

        res(rows);
      });
    });
  },
  unload: () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    dekkai.terminate();
  },
};
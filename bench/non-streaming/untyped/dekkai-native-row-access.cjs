const fs = require('fs');

module.exports = {
  name: 'dekkai (native, row access)',
  repo: 'https://github.com/darionco/dekkai',
  load: async () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    return (csvStr, path) => new Promise(res => {
      dekkai.init(1).then(async () => {
        const file = fs.openSync(path);

        let table = await dekkai.tableFromLocalFile(file);

        await table.forEach(row => {
          // do nothing
        });

        res(table);
      });
    });
  },
  countRows: (table) => table.rowCount,
  countCols: (table) => table.header.length,
  getSample: (table) => ['<native object>', '<native object>'],
  getTypes: (table) => new Set(table.columnTypes.map(t => t.name)),
  unload: () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    dekkai.terminate();
  },
};
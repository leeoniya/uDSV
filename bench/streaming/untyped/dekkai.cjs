const fs = require('fs');

module.exports = {
  name: 'dekkai native',
  repo: 'https://github.com/darionco/dekkai',
  load: async () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    return (csvStr, path) => new Promise(res => {
      dekkai.init(1).then(() => {
        const file = fs.openSync(path);

        dekkai.tableFromLocalFile(file).then(table => {
          res(Array(table.rowCount));
        });
      });
    });
  },
  unload: () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    dekkai.terminate();
  },
};

/*
{
  name: 'dekkai native (row access)',
  repo: 'https://github.com/darionco/dekkai',
  load: async () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    return (csvStr, path) => new Promise(res => {
      dekkai.init(1).then(() => {
        const file = fs.openSync(path);

        dekkai.tableFromLocalFile(file).then(table => {
          // console.log(table.rowCount);
          // process.exit();

          table.forEach(row => {

          }).then(() => {
            res(Array(table.rowCount));
          });
        });
      });
    });
  },
  unload: () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    dekkai.terminate();
  },
},
{
  name: 'dekkai native (cell access)',
  repo: 'https://github.com/darionco/dekkai',
  load: async () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    return (csvStr, path) => new Promise(res => {
      dekkai.init(1).then(() => {
        const file = fs.openSync(path);

        dekkai.tableFromLocalFile(file).then(table => {
          // console.log(table.rowCount);
          // process.exit();

          table.forEach(row => {
            row.forEach(val => { });
          }).then(() => {
            res(Array(table.rowCount));
          });
        });
      });
    });
  },
  unload: () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    dekkai.terminate();
  },
},
{
  name: 'dekkai',
  repo: 'https://github.com/darionco/dekkai',
  load: async () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    return (csvStr, path) => new Promise(res => {
      dekkai.init(1).then(() => {
        const file = fs.openSync(path);

        dekkai.tableFromLocalFile(file).then(table => {
          const rows = [];

          rows.push(table.mHeader.map(h => h.name));

          table.forEach(row => {
            let rowArr = [];
            row.forEach(val => {
              rowArr.push(val);
            });
            rows.push(rowArr);
          }).then(() => {
            res(rows);
          });
        });
      });
    });
  },
  unload: () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    dekkai.terminate();
  },
}
*/
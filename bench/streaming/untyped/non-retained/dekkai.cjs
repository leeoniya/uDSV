const fs = require('fs');

module.exports =   {
  name: 'dekkai (stream, sum)',
  repo: 'https://github.com/darionco/dekkai',
  load: async () => {
    const dekkai = require('dekkai/dist/umd/dekkai');

    return (csvStr, path) => new Promise(res => {
      dekkai.init(1).then(() => {
        const file = fs.openSync(path);

        let sum = 0;

        dekkai.iterateLocalFile(file, (row, index) => {
          sum += row.valueByIndexAsInt(6);
        }).then(() => {
          res([[sum],[sum]]);
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
*/
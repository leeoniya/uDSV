module.exports = {
  name: 'jquery-csv',
  repo: 'https://github.com/evanplaice/jquery-csv',
  load: async () => {
    const jqueryCsv = require('jquery-csv');

    return (csvStr, path) => new Promise(res => {
      let rows = jqueryCsv.toArrays(csvStr, {});
      res(rows);
    });
  },
};
module.exports = {
  name: 'comma-separated-values',
  repo: 'https://github.com/CyrusOfEden/CSV.js',
  load: () => {
    const CSV = require('comma-separated-values');

    return (csvStr, path) => new Promise(res => {
      // https://github.com/CyrusOfEden/CSV.js#quickstart
      let rows = CSV.parse(csvStr);
      res(rows);
    });
  },
};
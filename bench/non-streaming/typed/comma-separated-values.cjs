module.exports = {
  name: 'comma-separated-values typed {}',
  repo: 'https://github.com/CyrusOfEden/CSV.js',
  load: () => {
    const CSV = require('comma-separated-values');

    return (csvStr, path) => new Promise(res => {
      // https://github.com/CyrusOfEden/CSV.js#quickstart
      let rows = CSV.parse(csvStr, { header: true });
      res(rows);
    });
  },
};
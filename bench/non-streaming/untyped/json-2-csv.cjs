module.exports = {
  name: 'json-2-csv',
  repo: 'https://github.com/mrodrig/json-2-csv',
  load: async () => {
    const { default: converter } = await import('json-2-csv');

    return (csvStr, path) => new Promise((res, rej) => {
      let opts = { parseValue: v => v };

      converter.csv2json(csvStr, opts).then(rows => {
        res(rows);
      }).catch(e => rej(e));
    });
  },
};
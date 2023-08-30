module.exports = {
  name: 'csv-simple-parser',
  repo: 'https://github.com/fabiospampinato/csv-simple-parser',
  load: async () => {
    const { default: parse } = await import('csv-simple-parser');

    return (csvStr, path) => new Promise(res => {
      let rows = parse(csvStr);
      res(rows);
    });
  },
};
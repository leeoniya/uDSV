module.exports = {
  name: '@gregoranders/csv',
  repo: 'https://github.com/gregoranders/ts-csv',
  load: async () => {
    const CSV = await import('@gregoranders/csv');

    return (csvStr, path) => new Promise(res => {
      const parser = new CSV.Parser();
      let rows = parser.parse(csvStr);
      res(rows);
    });
  },
};
module.exports = {
  name: '@vanillaes/csv',
  repo: 'https://github.com/vanillaes/csv',
  load: async () => {
    const CSV = await import('@vanillaes/csv');

    return (csvStr, path) => new Promise(res => {
      let rows = CSV.parse(csvStr);
      res(rows);
    });
  },
};
// const reviver = value => value;
const reviver = undefined;

module.exports = {
  name: '@vanillaes/csv typed []',
  repo: 'https://github.com/vanillaes/csv',
  load: async () => {
    const CSV = await import('@vanillaes/csv');

    return (csvStr, path) => new Promise(res => {
      let rows = CSV.parse(csvStr, { typed: true }, reviver);
      res(rows);
    });
  },
};
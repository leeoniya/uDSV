module.exports = {
  name: 'ACsv',
  repo: 'https://github.com/amin2312/ACsv',
  load: async () => {
    const { default: acsv } = await import('../../lib/ACsv.cjs');

    return (csvStr, path) => new Promise(res => {
      const rows = acsv.acsv.Table.textToArray(csvStr);
      res(rows);
    });
  },
};
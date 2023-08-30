module.exports = {
  name: 'achilles-csv-parser',
  repo: 'https://github.com/freshp86/achilles-csv-parser',
  load: async () => {
    const { parse } = await import('achilles-csv-parser');

    return (csvStr, path) => new Promise(res => {
      let rows = parse(csvStr);
      res(rows);
    });
  },
};
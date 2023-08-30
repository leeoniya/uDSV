module.exports = {
  name: 'but-csv',
  repo: 'https://github.com/samthor/but-csv',
  load: async () => {
    const butCSV = await import('but-csv');

    return (csvStr, path) => new Promise(res => {
      let rows = butCSV.parse(csvStr);
      res(rows);
    });
  },
};
module.exports = {
  name: 'd3-dsv typed []',
  repo: 'https://github.com/d3/d3-dsv',
  load: async () => {
    const d3dsv = await import('d3-dsv');

    return (csvStr, path) => new Promise(res => {
      let rows = d3dsv.csvParseRows(csvStr, d3dsv.autoType);
      res(rows);
    });
  },
};
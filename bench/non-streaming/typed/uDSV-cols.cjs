module.exports = {
  name: 'uDSV typed cols',
  repo: 'https://github.com/leeoniya/uDSV',
  load: async () => {
    const { inferSchema, initParser } = await import('../../../dist/uDSV.cjs.js');

    return (csvStr, path) => new Promise(res => {
      let p = initParser(inferSchema(csvStr));
      let cols = p.typedCols(csvStr);
      cols._isCols = true;
      res(cols);
    });
  },
};
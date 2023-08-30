module.exports = {
  name: 'uDSV typed []',
  repo: 'https://github.com/leeoniya/uDSV',
  load: async () => {
    const { inferSchema, initParser } = await import('../../../dist/uDSV.cjs.js');

    return (csvStr, path) => new Promise(res => {
      let s = inferSchema(csvStr);
      let p = initParser(s); // rows => rows.slice(0, 3)
      let rows = p.typedArrs(csvStr);
      res(rows);
    });
  },
};
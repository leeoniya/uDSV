module.exports = {
  name: 'uDSV',
  repo: 'https://github.com/leeoniya/uDSV',
  load: async () => {
    const { inferSchema, initParser } = await import('../../../dist/uDSV.cjs.js');

    return (csvStr, path) => new Promise(res => {
      let p = initParser(inferSchema(csvStr));
      let rows = p.stringArrs(csvStr);  // p.typedObjs(csvStr);
      res(rows);
    });
  },
};
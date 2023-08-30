module.exports = {
  name: 'uDSV typed deep {}',
  repo: 'https://github.com/leeoniya/uDSV',
  load: async () => {
    const { inferSchema, initParser } = await import('../../../dist/uDSV.cjs.js');

    return (csvStr, path) => new Promise(res => {
      let p = initParser(inferSchema(csvStr));
      let rows = p.typedDeep(csvStr);
      res(rows);
    });
  },
};
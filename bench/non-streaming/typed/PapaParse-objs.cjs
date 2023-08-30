module.exports = {
  name: 'PapaParse typed {}',
  repo: 'https://github.com/mholt/PapaParse',
  load: async () => {
    const { default: Papa } = await import('papaparse');

    return (csvStr, path) => new Promise(res => {
      let rows = Papa.parse(csvStr, { header: true, dynamicTyping: true }).data;
      res(rows);
    });
  },
};
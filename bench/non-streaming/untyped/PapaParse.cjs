module.exports = {
  name: 'PapaParse',
  repo: 'https://github.com/mholt/PapaParse',
  load: async () => {
    const { default: Papa } = await import('papaparse');

    return (csvStr, path) => new Promise(res => {
      let rows = Papa.parse(csvStr).data; //  { header: true, dynamicTyping: true }
      res(rows);
    });
  },
};
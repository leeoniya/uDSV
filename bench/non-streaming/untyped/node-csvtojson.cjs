module.exports = {
  name: 'node-csvtojson',
  repo: 'https://github.com/Keyang/csvbench',
  repo: 'https://github.com/Keyang/node-csvtojson',
  load: async () => {
    const { default: csvToJson } = await import('csvtojson');

    return (csvStr, path) => {
      return csvToJson({ output: "csv", noheader: true, flatKeys: true }).fromString(csvStr);
    };
  },
};
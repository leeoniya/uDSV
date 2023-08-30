// doesnt work without explicit column typing?

/*
module.exports = {
  name: 'node-csvtojson typed []',
  repo: 'https://github.com/Keyang/csvbench',
  repo: 'https://github.com/Keyang/node-csvtojson',
  load: async () => {
    const { default: csvToJson } = await import('csvtojson');

    return (csvStr, path) => {
      return csvToJson({
        output: "csv",
        noheader: false,
        flatKeys: true,

        // https://github.com/Keyang/node-csvtojson#column-parser
        checkType: true,
        // colParser:{
        //   "column1":"omit",
        //   "column2":"string",
        //   "column2":"number",
        // },
      }).fromString(csvStr);
    };
  },
};
*/
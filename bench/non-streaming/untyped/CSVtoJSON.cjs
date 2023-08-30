module.exports = {
  name: 'CSVtoJSON',
  repo: 'https://github.com/iuccio/csvToJson',
  load: async () => {
    const CSVtoJSON = await import('convert-csv-to-json');

    return (csvStr, path) => new Promise(res => {
      let rows = CSVtoJSON
        .fieldDelimiter(',')
        .supportQuotedField(true)
        .csvStringToJson(csvStr);

      res(rows);
    });
  },
};
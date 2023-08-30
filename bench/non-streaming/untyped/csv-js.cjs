module.exports = {
  name: 'csv-js',
  repo: 'https://github.com/gkindel/csv-js',
  load: async () => {
    const { default: csvJS } = await import('csv-js');

    csvJS.DETECT_TYPES = false;

    return (csvStr, path) => new Promise(res => {
      let rows = csvJS.parse(csvStr);
      res(rows);
    });
  },
};
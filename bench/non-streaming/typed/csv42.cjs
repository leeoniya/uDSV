module.exports = {
  name: 'csv42 typed {}',
  repo: 'https://github.com/josdejong/csv42',
  load: async () => {
    // https://github.com/josdejong/csv42#csv2jsontcsv-string-options-jsonoptions--t
    // with numbers and embedded json, but no all-caps bools, no dates
    const { csv2json } = await import('csv42');

    return (csvStr, path) => new Promise(res => {
      let rows = csv2json(csvStr, { nested: false, header: true });
      res(rows);
    });
  },
};
module.exports = {
  name: 'csv42',
  repo: 'https://github.com/josdejong/csv42',
  load: async () => {
    // https://github.com/josdejong/csv42#csv2jsontcsv-string-options-jsonoptions--t
    // with numbers and embedded json, but no all-caps bools, no dates
    const { csv2json } = await import('csv42');

    function parseValue(value) {
      return value.startsWith('"') ? value.substring(1, value.length - 1).replaceAll('""', '"') : value;
    }

    // doesnt work, since originals contain raw quote-escaped quotes
    // const parseValue2 = value => value;

    return (csvStr, path) => new Promise(res => {
      let rows = csv2json(csvStr, { nested: false, header: true, parseValue }); // , parseValue: null
      res(rows);
    });
  },
};
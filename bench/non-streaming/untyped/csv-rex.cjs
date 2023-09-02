module.exports = {
  name: 'csv-rex',
  repo: 'https://github.com/willfarrell/csv-rex',
  load: async () => {
    const { parse } = await import('csv-rex');

    return (csvStr, path) => new Promise(res => {
      let rows = parse(csvStr, { header: false }); // faster than default header: true (objects)
      res(rows);
    });
  },
};
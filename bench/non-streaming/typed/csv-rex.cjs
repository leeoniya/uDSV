const transform = (value) => {
  if (value === '')
    return null;
  if (value === 'FALSE')
    return false;
  if (value === 'TRUE')
    return true;

  if (value[0] === '{' || value[0] === '[')
    return JSON.parse(value);

  let asNum = +value;

  if (!Number.isNaN(asNum))
    return asNum;

  return value;
};

module.exports = {
  name: 'csv-rex typed []',
  repo: 'https://github.com/willfarrell/csv-rex',
  load: async () => {
    const { parse } = await import('csv-rex');

    return (csvStr, path) => new Promise(res => {
      let rows = parse(csvStr, {
        header: false,
        coerceField: transform,
      });
      res(rows);
    });
  },
};
const infer = value => {
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
  name: 'csv-simple-parser typed {}',
  repo: 'https://github.com/fabiospampinato/csv-simple-parser',
  load: async () => {
    const { default: parse } = await import('csv-simple-parser');

    return (csvStr, path) => new Promise(res => {
      let rows = parse(csvStr, { header: true, infer });
      res(rows);
    });
  },
};
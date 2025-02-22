const RE_IS_DATE = /^\d{4}-\d{2}-\d{2}/;

const infer = value => {
  if (value === '')
    return null;
  if (value === 'FALSE')
    return false;
  if (value === 'TRUE')
    return true;

  if (value[0] === '{' || value[0] === '[')
    return JSON.parse(value);

  if (RE_IS_DATE.test(value))
      return new Date(value);

  let asNum = +value;

  if (!Number.isNaN(asNum))
    return asNum;

  return value;
};

module.exports = {
  name: 'csv-simple-parser typed []',
  repo: 'https://github.com/fabiospampinato/csv-simple-parser',
  load: async () => {
    const { default: parse } = await import('csv-simple-parser');

    return (csvStr, path) => new Promise(res => {
      let rows = parse(csvStr, { infer });
      // console.log(rows[0], rows[1]);
      // process.exit();
      res(rows);
    });
  },
};
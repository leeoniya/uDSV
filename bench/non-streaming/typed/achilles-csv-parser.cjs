const reviver = (key, value) => {
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
  name: 'achilles-csv-parser typed {}',
  repo: 'https://github.com/freshp86/achilles-csv-parser',
  load: async () => {
    const { parse } = await import('achilles-csv-parser');

    return (csvStr, path) => new Promise(res => {
      let rows = parse(csvStr, reviver);
      res(rows);
    });
  },
};
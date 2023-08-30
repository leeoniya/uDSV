const mapper = ({ header, index, value }) => {
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
  name: 'csv-parser (neat-csv) typed {}',
  repo: 'https://github.com/mafintosh/csv-parser',
  repo: 'https://github.com/sindresorhus/neat-csv', // wrapper for https://github.com/mafintosh/csv-parser
  load: async () => {
    const { default: neatCsv } = await import('neat-csv');

    return (csvStr, path) => new Promise(res => {
      neatCsv(csvStr, {
        strict: true,
        mapValues: mapper,
      }).then(rows => {
        // console.log(rows);
        res(rows);
      });
    });
  },
};
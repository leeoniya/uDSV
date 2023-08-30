// https://github.com/josdejong/csv42/blob/19df419b31bef64cc9d80f8cd3cf560ef79845da/benchmark/libraries.ts#L126
// https://github.com/josdejong/csv42/blob/19df419b31bef64cc9d80f8cd3cf560ef79845da/benchmark/libraries.ts#L52-L62

function transform(value) {
  const number = Number(value)
  if (!isNaN(number) && !isNaN(parseFloat(value))) {
    return number;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === 'null' || value === '') {
    return null;
  }

  if (value[0] === '{' || value[0] === '[') {
    return JSON.parse(value);
  }

  return value;
}

/*
module.exports = {
  name: 'PapaParse deep {}',
  repo: 'https://github.com/mholt/PapaParse',
  load: async () => {
    const { default: Papa } = await import('papaparse');
    const { default: flat } = await import('flat');

    return (csvStr, path) => new Promise(res => {
      let deep = flat.unflatten(Papa.parse(csvStr, { header: true, transform }).data.map(flat.unflatten));
      res(deep);
    });
  },
};
*/

// no JSON
module.exports = {
  name: 'PapaParse deep {}',
  repo: 'https://github.com/mholt/PapaParse',
  load: async () => {
    const { default: Papa } = await import('papaparse');
    const { default: flat } = await import('flat');

    return (csvStr, path) => new Promise(res => {

      let rows = Papa.parse(csvStr, { header: true, dynamicTyping: true }).data;

      for (let key in rows[0]) {
        let v = rows[0][key];

        if (typeof v === 'string' && (v[0] === '{' || v[0] === '[')) {
          for (let i = 0; i < rows.length; i++) {
            rows[i][key] = JSON.parse(rows[i][key]);
          }
        }
      }

    // let rows = Papa.parse(csvStr, { header: true, dynamicTyping: true, transform: transform }).data;
      let deep = flat.unflatten(rows.map(flat.unflatten));
      res(deep);
    });
  },
};
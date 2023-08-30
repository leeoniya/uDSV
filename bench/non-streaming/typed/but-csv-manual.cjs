module.exports = {
  name: 'but-csv typed [] manual',
  repo: 'https://github.com/samthor/but-csv',
  load: async () => {
    const butCSV = await import('but-csv');

    return (csvStr, path) => new Promise(res => {
      let rows = butCSV.parse(csvStr);

      let numCols = rows[0].length;

      let toInts = new Function('rows', `
          let rows2 = Array(rows.length);

          for (let ri = 0; ri < rows.length; ri++) {
            let r = rows[ri];

            rows2[ri] = ri === 0 ? r : [${Array.from({ length: numCols }, (v, i) => `+r[${i}]`).join()
        }];
          }

          return rows2;
        `);

      let rows2 = toInts(rows);
      res(rows2);
    });
  },
};
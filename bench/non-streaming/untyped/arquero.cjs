module.exports = {
  name: 'arquero',
  repo: 'https://github.com/uwdata/arquero',
  load: async () => {
    const { fromCSV } = await import('arquero');

    return (csvStr, path) => new Promise(res => {
      let table = fromCSV(csvStr, { header: true, autoType: false });

      let rows = [];

      let numCols = table.numCols();
      let data = table.data();
      let cols = Object.keys(data);
      let len = table.numRows();

      for (let i = 0; i < len; i++) {
        let row = Array(numCols);

        for (let ci = 0; ci < numCols; ci++)
          row[ci] = table.get(cols[ci], i);

        rows.push(row);
      }

      res(rows);
    });
  },
};
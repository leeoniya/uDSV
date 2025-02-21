module.exports = {
  name: 'arquero typed []',
  repo: 'https://github.com/uwdata/arquero',
  load: async () => {
    const { fromCSV } = await import('arquero');

    return (csvStr, path) => new Promise(res => {
      let table = fromCSV(csvStr, { header: true, autoType: true, autoMax: 30 });
      let rows = [];

      let numRows = table.numRows();
      let numCols = table.numCols();
      let data = table.data();
      let cols = Object.keys(data);

      for (let i = 0; i < numRows; i++) {
        let row = Array(numCols);

        for (let ci = 0; ci < numCols; ci++)
          row[ci] = table.get(cols[ci], i);

        rows.push(row);
      }

      res(rows);
    });
  },
  // countRows: (table) => table.numRows(),
  // countCols: (table) => table.numCols(),
  // getSample: (table) => {
  //   for (let i = 0; i < )
  //   for (let k in table.data()) {

  //   }
  // },
};
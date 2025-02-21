module.exports = {
  name: 'arquero (native)',
  repo: 'https://github.com/uwdata/arquero',
  load: async () => {
    const { fromCSV } = await import('arquero');

    return (csvStr, path) => new Promise(res => {
      let table = fromCSV(csvStr, { header: true, autoType: false });
      res(table);
    });
  },
  countRows: (table) => table.numRows(),
  countCols: (table) => table.numCols(),
  getSample: (table) => {
    let rows = [];

    let numCols = table.numCols();
    let data = table.data();
    let cols = Object.keys(data);

    for (let i = 0; i < 10; i++) {
      let row = Array(numCols);

      for (let ci = 0; ci < numCols; ci++)
        row[ci] = table.get(cols[ci], i);

      rows.push(row);
    }

    return rows;
  },
};
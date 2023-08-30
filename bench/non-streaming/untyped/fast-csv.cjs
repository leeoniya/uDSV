module.exports = {
  name: '@fast-csv/parse',
  repo: 'https://github.com/C2FO/fast-csv',
  load: async () => {
    const fastCSV = await import('@fast-csv/parse');

    return (csvStr, path) => new Promise(res => {
      const rows = [];

      fastCSV.parseString(csvStr, {
        headers: headers => headers.map((h, i) => h + i)
      })
        .on('error', error => console.error(error))
        .on('data', row => {
          rows.push(row);
        })
        .on('end', rowCount => {
          res(rows);
        });
    });
  }
};
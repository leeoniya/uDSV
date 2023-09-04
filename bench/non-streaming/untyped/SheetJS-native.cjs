module.exports = {
  name: 'SheetJS (native)',
  repo: 'https://git.sheetjs.com/sheetjs/sheetjs',
  load: async () => {
    const XLSX = await import('xlsx');

    return (csvStr, path) => new Promise(res => {
      // https://docs.sheetjs.com/docs/api/parse-options/
      let sheet = XLSX.read(csvStr, { raw: true, dense: true, type: 'string' }).Sheets['Sheet1'];
      res(sheet["!data"]);
    });
  },
  // countRows: (data) => data.length,
  // countCols: (data) => data[0].length,
  // getSample: (data) => ['<native object>', '<native object>'],
  getTypes:  (data) => new Set(data[0].map(c => c.t)),
};
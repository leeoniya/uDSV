module.exports = {
  name: 'SheetJS (native) typed',
  repo: 'https://git.sheetjs.com/sheetjs/sheetjs',
  load: async () => {
    const XLSX = await import('xlsx');

    return (csvStr, path) => new Promise(res => {
      // https://docs.sheetjs.com/docs/api/parse-options/
      let sheet = XLSX.read(csvStr, { raw: false, dense: true, type: 'string' }).Sheets['Sheet1'];
      res(sheet["!data"]);
    });
  },
};

/*
  {
    name: 'SheetJS',
    repo: 'https://git.sheetjs.com/sheetjs/sheetjs',
    load: async () => {
      const XLSX = await import('xlsx');

      return (csvStr, path) => new Promise(res => {
        // https://docs.sheetjs.com/docs/api/parse-options/
        let sheet = XLSX.read(csvStr, { raw: false, dense: true, type: 'string' }).Sheets['Sheet1'];
        let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        res(rows);
      });
    },
  }
*/
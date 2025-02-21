module.exports = {
    name: 'tiddlycsv',
    repo: 'https://github.com/samthor/tiddlycsv',
    load: async () => {
      const { parseCSV } = await import('tiddlycsv');

      return (csvStr, path) => new Promise(res => {
        let rows = parseCSV(csvStr);
        res(rows);
      });
    },
  };
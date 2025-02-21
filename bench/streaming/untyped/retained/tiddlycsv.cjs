const fs = require('fs');

module.exports = {
    name: 'tiddlycsv (stream)',
    repo: 'https://github.com/samthor/tiddlycsv',
    load: async () => {
      const { streamCSVChunk } = await import('tiddlycsv');

      return (async (csvStr, path) => {
        const file = fs.createReadStream(path);
        const csvStream = streamCSVChunk(file.iterator());
        let rows = [];

        for await(const chunk of csvStream)
            rows.push(...chunk);

        return rows;
      })
    },
    // countRows: (result) => {
    //     console.log(result);
    // },
  };
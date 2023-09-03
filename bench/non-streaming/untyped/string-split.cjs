module.exports = {
  name: 'String.split()',
  repo: null,
  load: async () => {
    return (csvStr, path) => new Promise(res => {
      let lines = csvStr.split('\n');
      let rows = Array(lines.length);
      for (let i = 0; i < lines.length; i++)
        rows[i] = lines[i].split(',');
      res(rows);
    });
  },
};
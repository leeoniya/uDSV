module.exports = {
  name: 'csv-rex (stream)',
  repo: 'https://github.com/willfarrell/csv-rex',
  load: async () => {
    const { createReadStream } = await import('node:fs');
    const { pipejoin, streamToArray } = await import('@datastream/core');
    const { csvParseStream } = await import('@datastream/csv');

    return (csvStr, path) => new Promise(res => {
      const streams = [
        createReadStream(path),
        csvParseStream({ header: false }),
      ];

      const stream = pipejoin(streams);
      streamToArray(stream).then(res);
    });
  },
};

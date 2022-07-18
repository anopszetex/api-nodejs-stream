import axios from 'axios';
import { PassThrough, Writable } from 'node:stream';

const API_01 = 'http://localhost:5000';
const API_02 = 'http://localhost:6000';

// ?=- he make search through of the - and looks back
// :"(\?<name>.*) looking for the content inside quotation marks after : and extract only name
// eslint-disable-next-line node/no-unsupported-features/es-syntax
const REGEX_NAME = /:"(?<name>.*)(?=-)/;

(async () => {
  const requests = await Promise.all([
    axios({
      method: 'get',
      url: API_01,
      responseType: 'stream',
    }),
    axios({
      method: 'get',
      url: API_02,
      responseType: 'stream',
    }),
  ]);

  const results = requests.map(({ data }) => data);

  const output = Writable({
    write(chunk, _, callback) {
      const data = chunk.toString().replace('\n', '');

      const name = data.match(REGEX_NAME).groups.name;
      console.log(name);
      callback();
    },
  });

  // results[0].pipe(output);
  // result[1].pipe(output);

  function merge(streams) {
    return streams.reduce((prev, current, index, items) => {
      // prevents it from closing by itself
      current.pipe(prev, { end: false });
      current.on('end', () => items.every(s => s.ended) && prev.end());

      return prev;
    }, new PassThrough());
  }

  merge(results).pipe(output);
})();

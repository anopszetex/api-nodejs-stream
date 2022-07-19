import axios from 'axios';
import { pipeline } from 'node:stream/promises';

const API_01 = 'http://localhost:5000';
const API_02 = 'http://localhost:6000';

const REGEX_NAME = /:"(?<name>.*)(?=-)/;
const REGEX_BREAK_LINE = '\n';

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

  async function output(stream) {
    for await (const chunk of stream) {
      const name = chunk.match(REGEX_NAME).groups.name;
      console.log(name);
    }
  }

  async function* merge(streams) {
    for (const readable of streams) {
      readable.setEncoding('utf8');

      for await (const chunk of readable) {
        for (const line of chunk.trim().split(REGEX_BREAK_LINE)) {
          yield line;
        }
      }
    }
  }

  await pipeline(merge(results), output);
})();

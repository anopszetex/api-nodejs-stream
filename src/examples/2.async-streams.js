import { pipeline } from 'node:stream/promises';
import { setTimeout } from 'node:timers/promises';

(async () => {
  async function* myCustomReadable() {
    yield Buffer.from('this is my');
    await setTimeout(1000);
    yield Buffer.from('custom readable');
  }

  async function* myCustomTransform(stream) {
    for await (const chunk of stream) {
      yield chunk.toString().replace(/\s/g, '_');
    }
  }

  async function* myCustomDuplex(stream) {
    let bytesRead = 0;
    const wholeString = [];

    for await (const chunk of stream) {
      console.log('[Duplex writable]', chunk);

      bytesRead += chunk.length;
      wholeString.push(chunk);
    }

    yield `wholeString ${wholeString}`;
    yield `bytesRead ${bytesRead}`;
  }

  async function myCustomWritable(stream) {
    for await (const chunk of stream) {
      console.log('[Writable]', chunk);
    }
  }

  try {
    const controller = new AbortController();

    setImmediate(() => controller.abort());

    await pipeline(
      myCustomReadable,
      myCustomTransform,
      myCustomDuplex,
      myCustomWritable,
      { signal: controller.signal }
    );

    console.log('process has finished');
  } catch (err) {
    console.error('\nAborted:', err.message, '\n');
  }
})();

import Event from 'node:events';
import { createReadStream, createWriteStream } from 'node:fs';
import { Transform, pipeline } from 'node:stream';
import { setTimeout } from 'node:timers/promises';
import util from 'node:util';

const pipelineAsync = util.promisify(pipeline);

const kEvent = Symbol('kEvent');

class Service {
  constructor() {
    this[kEvent] = new Event();
  }

  emit(event, data) {
    this[kEvent].emit(event, data);
  }

  on(event, listener) {
    this[kEvent].on(event, listener);
  }
}

const timerClock = () => {
  return {
    counter: 0,
    /**
     * define a property of an object,
     * but they do not calculate the property's value until it is accessed
     */
    get count() {
      return this.counter;
    },
    set count(value) {
      this.counter += value;
    },
  };
};

(async () => {
  const service = new Service();

  service.on('update', data => {
    console.log('〽️ ', data);
  });

  console.log('🔔 waiting for an event...');
  await setTimeout(500);

  {
    service.emit('update', 0);
  }

  /**
   * Stream to readfile and writefile
   */
  const prepareStream = () => {
    const stream = createReadStream('./data/2019.ndjson');

    return { stream };
  };

  async function* progressBar(stream) {
    for await (const data of stream) {
      progress.count = 1;
      service.emit('update', progress.count);
      yield data;
    }
  }

  const progress = timerClock();

  const upperCase = Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    },
  });

  async function* myCustomWritable(stream) {
    for await (const chunk of stream) {
      yield chunk;
    }
  }

  const runProcess = async () => {
    const { stream } = prepareStream();

    await pipelineAsync(
      stream,
      progressBar,
      upperCase,
      myCustomWritable,
      createWriteStream('./newFile.txt')
    );

    service.emit('update', 'Pipeline succeeded.');
  };

  await runProcess().catch(err => {
    console.error('Pipeline failed:', err);
  });
})();

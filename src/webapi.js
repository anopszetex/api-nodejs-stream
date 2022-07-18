import { randomUUID as uuid } from 'node:crypto';
import http from 'node:http';
import { Readable } from 'node:stream';

function api1(_, response) {
  /* response.write('test01\n')
  response.write('test02\n')
  response.write('test03\n')
  request.pipe(response) */

  let count = 0;
  const maxItems = 99;

  const readable = Readable({
    read() {
      const everySecond = intervalContext => {
        if (count++ <= maxItems) {
          this.push(JSON.stringify({ id: uuid, name: `and-${count}` }) + '\n');
          return;
        }

        this.push(null);
        clearInterval(intervalContext);
      };

      setInterval(() => {
        return everySecond(this);
      });
    },
  });

  readable.pipe(response);
}

function api2(_, response) {
  let count = 0;
  const maxItems = 99;

  const readable = Readable({
    read() {
      const everySecond = intervalContext => {
        if (count++ <= maxItems) {
          this.push(JSON.stringify({ id: uuid, name: `zeca-${count}` }) + '\n');
          return;
        }

        this.push(null);
        clearInterval(intervalContext);
      };

      setInterval(() => {
        return everySecond(this);
      });
    },
  });

  readable.pipe(response);
}

http.createServer(api1).listen(5000, () => {
  console.log('Server running on port 5000');
});

http.createServer(api2).listen(6000, () => {
  console.log('Server running on port 6000');
});

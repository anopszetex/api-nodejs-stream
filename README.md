# Working with Node.js Stream

### Build Setup
Install dependencies
```sh
npm install
```

Start server
```sh
npm run start-server
```

To check server and save logs
`run` the commands:
```sh
npm run api1
npm run api2
```
Results similar to:
> api1
```
> @anopszetex/example-project@1.0.0 api1
> curl localhost:5000 | tee logs/api1.log

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1792    0  1792    0     0   102k      0 --:--:-- --:--:-- --:--:--  102k
{"name":"and-1"}
```

> api2
```
> @anopszetex/example-project@1.0.0 api2
> curl localhost:6000 | tee logs/api2.log

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1892    0  1892    0     0   142k      0 --:--:-- --:--:-- --:--:--  142k
{"name":"zeca-1"}
```

## With server running
### 1) Concat Stream - PassThrough
```sh
npm run example01
```

### 2) Async Stream
```sh
npm run example02
```

### 3) Concat Stream - Async Iterator
```sh
npm run example02
```

### 4) Consume Data
Read the file `2019.ndjson` and count of number of files called given using `Events` of node, also copy the data and transform to uppercase and create a new file as **txt** and send the modifications.
```sh
npm run example04
```

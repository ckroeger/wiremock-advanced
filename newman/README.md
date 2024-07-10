# newman backend
A simple express server that uses newman to execute postman-collections

Usage:
```bash
node index.js
```

## Endpoints
* GET http://localhost:3000/collections
  * returns all postman-collection names
* GET http://localhost:3000/run/:name
  * takes name of the postman-collection to execute
  * displays the output of the execution
* GET http://localhost:3000/nm/echo
  * returns a simple message in plain text

## Curl Examples

### list all postman-collections
```bash
curl http://localhost:3000/collections
```

### execute a postman-collection with human-readable output
```bash
curl http://localhost:3000/run/echo-collection.json
```

### execute a postman-collection with json output
```bash
curl http://localhost:3000/run/echo-collection.json?asJson=true
```

### call a simple echo endpoint in verbose mode
```bash
curl -v http://localhost:3000/nm/echo
```


const http = require ('http');
const app = require ('.');
const port = process.env.port || 5000
const server = http.createServer (app)
server.listen (port);
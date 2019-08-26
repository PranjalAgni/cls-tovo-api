const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');

server.use(router);
server.listen(4040, () => {
  console.log('JSON Server is running');
});

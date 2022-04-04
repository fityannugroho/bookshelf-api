require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

(async () => {
  // Initialize the server.
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: true,
    },
  });

  // Add the routes.
  server.route(routes);

  // Start the server.
  await server.start();
  console.log('Server running on %s', server.info.uri);
})();

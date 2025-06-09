const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { socketManager } = require("./lib/socket");
const { IncomingMessage, ServerResponse } = require("http");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(
    (req: typeof IncomingMessage, res: typeof ServerResponse) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }
  );

  // Initialize Socket.IO server using the socket manager
  socketManager.initialize(server);

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

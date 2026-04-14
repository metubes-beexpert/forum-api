import "dotenv/config";
import createServer from "./Infrastructures/http/createServer.js";
import container from "./Infrastructures/container.js";
import config from "./Commons/config.js";

const app = await createServer(container);
const { host, port } = config.app;

if (process.env.VERCEL !== '1') {
  app.listen(port, host, () => {
    console.log(`server start at http://${host}:${port}`);
  });
}

export default app;

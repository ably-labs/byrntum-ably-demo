
import { handler } from "@api/handler";
import { endpoints } from "@api/routers";
import * as configure from "@api/configure";
import express from "express";


const server = express();
configure.serverBefore?.(server);
const { PORT = 3000, PUBLIC_DIR = "import.meta.env.PUBLIC_DIR" } = process.env;
server.use("import.meta.env.BASE", express.static(PUBLIC_DIR));
server.use("import.meta.env.BASE_API", handler);
configure.serverAfter?.(server);
server.on("error", (error) => {
  console.error(`Error at http://localhost:${PORT}import.meta.env.BASE`, error);
  configure.serverError?.(server, error);
});
server.listen(PORT, () => {
  console.log(`Ready at http://localhost:${PORT}import.meta.env.BASE`);
  configure.serverListening?.(server, endpoints);
});

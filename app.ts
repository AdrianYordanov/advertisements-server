// External
import express from "express";
import cors from "cors";
// Config
import dbConfig from "./config/db";
import middlewareConfig from "./config/middleware";
import routesConfig from "./config/routes/index";

const port = process.env.PORT || 3001;
const app = express();

dbConfig();
middlewareConfig(app);
routesConfig(app);

app.use(cors());
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

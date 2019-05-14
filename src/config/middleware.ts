// External
import bodyParser, { json } from "body-parser";
import morgan from "morgan";

export default (app: { use: Function }) => {
  app.use(morgan("dev"));
  app.use(json());
  app.use(bodyParser.urlencoded({ extended: true }));
};

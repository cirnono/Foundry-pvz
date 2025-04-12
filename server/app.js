import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/** ROUTE IMPORT */
import contractRoutes from "./routes/contractRoutes.js";

/** CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // middleware

/** ROUTES */
app.use("/api/", contractRoutes);

app.get("/", (req, res) => {
  res.send("This is home route");
});

/** SERVER */
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

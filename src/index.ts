import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bookingRoutes from "./ports/rest/routes/booking";
import userRoutes from "./ports/rest/routes/user";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/healthcheck", (_req, res) => {
  return res.status(200).json({
    message: "Successful",
    storage: "in-memory only"
  });
});

app.use("/user", userRoutes);
app.use("/booking", bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
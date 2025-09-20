import express from "express";
import dotenv from "dotenv";
import { sendMessage } from "./utils/utils.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/mail", async (req, res) => {
  try {
    await sendMessage(req.body.sub, req.body.txt);
    res.json({ result: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "failure" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
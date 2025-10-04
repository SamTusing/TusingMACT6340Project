import express from "express";
import dotenv from "dotenv";
import { sendMessage } from "./utils/utils.js";
dotenv.config();
import * as db from "./utils/database.js";
let data = ["Project 1", "Project 2", "Project 3"];
let projects = [];


const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));


app.get("/", async (req, res, next) => {
  await db
    .connect()
    .then(async () => {
      // query the databse for project records
      projects = await db.getAllProjects();
      console.log(projects);
      let featuredRand = Math.floor(Math.random() * projects.length);
      res.render("index.ejs", { featuredProject: projects[featuredRand] });
    })
    .catch(next);
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/featured", (req, res) => {
  res.render("featured.ejs", { projectArray: data });
});

app.get("/projects", (req, res) => {
  res.render("projects.ejs", { projectArray: data });
});

app.get("/projects/:id", (req, res) => {
 let id = req.params.id;
 if (id > data.length) {
   throw new Error("No project with that ID");
 }
 res.render("projects.ejs", { projectArray: data, which: id });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});


app.post("/mail", async (req, res) => {
  try {
    await sendMessage(req.body.sub, req.body.txt);
    res.json({ result: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "failure" });
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  let msg;
  msg = err.message;
  if (msg != "No project with that ID") {
    msg =
      "There was an internal error. Apologies. We are working on cleaning up the mess.";
  }
  res.render("error.ejs", { msg: msg });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
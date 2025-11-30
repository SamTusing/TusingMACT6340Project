import express from "express";
import dotenv from "dotenv";
import { sendMessage } from "./utils/utils.js";
dotenv.config();
import * as db from "./utils/database.js";
let data = ["Project 1", "Project 2", "Project 3"];
let projects = [];
import cors from "cors";


const app = express();
app.use(cors());
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

app.get("/projects", (req, res) => {
  res.render("projects.ejs", { projectArray: projects });
});

app.get("/project/:id", (req, res) => {
  let id = req.params.id;
  if (id > data.length) {
    throw new Error("No project with that ID");
  }
  console.log(projects[id -1]);
  res.render("project.ejs", { project: projects[id - 1], which: id });
});

// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });



app.get("/featured", (req, res) => {
  res.render("featured.ejs", { projectArray: data });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/miscellaneous", (req, res) => {
  res.render("miscellaneous.ejs");
});


app.get('/landscapes', (req, res) => {
  res.render("landscapes.ejs");
});

app.get('/digital-art', (req, res) => {
  res.render("digital-art.ejs");
});

app.get('/MACTProjects', (req, res) => {
  res.render("MACTProjects.ejs");
});

app.get('/Texas-Hold-Em', (req, res) => {
  res.render("Texas-Hold-Em.ejs");
});

app.get('/badges', (req, res) => {
  res.render("badges.ejs");
});

app.get('/digital-art', (req, res) => {
  res.render("digital-art.ejs");
});

app.get('/whales', (req, res) => {
  res.render("whales.ejs");
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
  console.log(`Example app listening on port ${port}`);
});
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const usersRouter = require("./users");
const tasksRouter = require("./tasksRouter");
const projectsRouter = require("./projectsRouter");
const port = 3001;

app.use(bodyParser.json());

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);
app.use("/projects", projectsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

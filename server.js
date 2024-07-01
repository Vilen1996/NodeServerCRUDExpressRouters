const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const usersRouter = require("./users");
const tasksRouter = require("./tasksRouter");
const projectsRouter = require("./projectsRouter");
const port = 3001;

app.use(bodyParser.json());

app.use("/projects/users", usersRouter);
app.use("/projects/tasks", tasksRouter);
app.use("/projects", projectsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

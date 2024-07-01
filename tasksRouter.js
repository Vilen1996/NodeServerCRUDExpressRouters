const express = require("express");
const tasksRouter = express.Router();
const fs = require("fs");

tasksRouter.post("/", (req, res) => {
  let newTask = req.body;

  fs.readFile("tasks.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    let tasks = [];
    try {
      tasks = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }
    tasks.push(newTask);

    fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Cannot add task");
        return res.status(500).send("Internal server error");
      }
      return res.status(201).send({ message: "Task created" });
    });
  });
});

tasksRouter.get("/", (req, res) => {
  fs.readFile("projects.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }
    let projects = [];
    try {
      projects = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }

    fs.readFile("tasks.json", "utf-8", (err, data) => {
      if (err) {
        console.error("File does not exist");
        return res.status(500).send("Internal server error");
      }
      let tasks = [];
      try {
        tasks = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing JSON data");
        if (data.trim() !== "") {
          return res.status(500).send("Internal server error");
        }
      }
      const filteredTasks = tasks.filter((u) =>
        projects[0].tasks.includes(u.id)
      );
      res.status(200).send(filteredTasks);
    });
  });
});

tasksRouter.get("/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  fs.readFile("tasks.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }
    let tasks = [];
    try {
      tasks = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }
    let foundedTask = tasks.find((u) => u.id == taskId);
    res.status(200).send(foundedTask);
  });
});

tasksRouter.delete("/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  fs.readFile("tasks.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    let tasks = [];
    try {
      tasks = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }
    const filteredTasks = tasks.filter((u) => u.id != taskId);

    fs.writeFile(
      "tasks.json",
      JSON.stringify(filteredTasks, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Cannot add task");
          return res.status(500).send("Internal server error");
        }
        return res.status(201).send({ message: "Task created" });
      }
    );
  });
});

tasksRouter.put("/:taskId", (req, res) => {
  const updateId = req.params.taskId;
  const updatedTask = req.body;

  fs.readFile("tasks.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }
    let tasks = [];
    try {
      tasks = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }
    const taskIndex = tasks.findIndex((u) => u.id == updateId);

    if (taskIndex == -1) {
      return res.status(404).send({ message: "Task not found" });
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Cannot update user");
        return res.status(500).send("Internal server error");
      }
      return res.status(200).send({ message: "Task updated" });
    });
  });
});

module.exports = tasksRouter;

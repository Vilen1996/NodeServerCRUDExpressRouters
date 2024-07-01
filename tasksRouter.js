const express = require("express");
const tasksRouter = express.Router();
const fs = require("fs");

tasksRouter.post("/:projectId/tasks", (req, res) => {
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

tasksRouter.get("/:projectId/tasks", (req, res) => {
  const projectId = parseInt(req.params.projectId);
  fs.readFile("projects.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading projects file");
      return res.status(500).send("Internal server error");
    }

    let projects = [];
    try {
      projects = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing projects JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }

    const project = projects.find((proj) => proj.id === projectId);
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    fs.readFile("tasks.json", "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading tasks file");
        return res.status(500).send("Internal server error");
      }

      let tasks = [];
      try {
        tasks = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing tasks JSON data");
        if (data.trim() !== "") {
          return res.status(500).send("Internal server error");
        }
      }

      const filteredTasks = tasks.filter((task) =>
        project.tasks.includes(task.id)
      );
      res.status(200).send(filteredTasks);
    });
  });
});

tasksRouter.get("/:projectId/tasks/:taskId", (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const taskId = parseInt(req.params.taskId);

  fs.readFile("projects.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading projects file");
      return res.status(500).send("Internal server error");
    }

    let projects = [];
    try {
      projects = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing projects JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }

    const project = projects.find((proj) => proj.id === projectId);
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    fs.readFile("tasks.json", "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading tasks file");
        return res.status(500).send("Internal server error");
      }

      let tasks = [];
      try {
        tasks = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing tasks JSON data");
        if (data.trim() !== "") {
          return res.status(500).send("Internal server error");
        }
      }

      const filteredTasks = tasks.filter((task) =>
        project.tasks.includes(task.id)
      );
      const findedTask = filteredTasks.find((task) => task.id === taskId);

      if (!findedTask) {
        return res.status(404).send({ message: "Task not found" });
      }

      res.status(200).send(findedTask);
    });
  });
});

tasksRouter.delete("/:projectId/tasks/:taskId", (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const taskId = parseInt(req.params.taskId);

  fs.readFile("projects.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading projects file");
      return res.status(500).send("Internal server error");
    }

    let projects = [];
    try {
      projects = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing projects JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }

    const project = projects.find((proj) => proj.id === projectId);
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    fs.readFile("tasks.json", "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading tasks file");
        return res.status(500).send("Internal server error");
      }

      let tasks = [];
      try {
        tasks = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing tasks JSON data");
        if (data.trim() !== "") {
          return res.status(500).send("Internal server error");
        }
      }

      const taskIndex = tasks.findIndex((task) => task.id === taskId);

      if (taskIndex === -1 || !project.tasks.includes(taskId)) {
        return res.status(404).send({ message: "Task not found in project" });
      }

      tasks.splice(taskIndex, 1);
      project.tasks = project.tasks.filter((id) => id !== taskId);

      fs.writeFile(
        "projects.json",
        JSON.stringify(projects, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing to projects file");
            return res.status(500).send("Internal server error");
          }

          fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
              console.error("Error writing to tasks file");
              return res.status(500).send("Internal server error");
            }

            res.status(200).send({ message: "Task deleted successfully" });
          });
        }
      );
    });
  });
});

tasksRouter.put("/:projectId/tasks/:taskId", (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const taskId = parseInt(req.params.taskId);
  const updatedTask = req.body;

  fs.readFile("projects.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading projects file");
      return res.status(500).send("Internal server error");
    }

    let projects = [];
    try {
      projects = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing projects JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }

    const project = projects.find((proj) => proj.id === projectId);
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    fs.readFile("tasks.json", "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading tasks file");
        return res.status(500).send("Internal server error");
      }

      let tasks = [];
      try {
        tasks = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing tasks JSON data");
        if (data.trim() !== "") {
          return res.status(500).send("Internal server error");
        }
      }

      const taskIndex = tasks.findIndex((task) => task.id == taskId);

      if (taskIndex === -1 || !project.tasks.includes(taskId)) {
        return res.status(404).send({ message: "Task not found in project" });
      }

      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };

      fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
          console.error("Error writing to tasks file");
          return res.status(500).send("Internal server error");
        }

        res.status(200).send({ message: "Task updated successfully" });
      });
    });
  });
});

module.exports = tasksRouter;

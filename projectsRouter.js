const express = require("express");
const projectsRouter = express.Router();
const fs = require("fs");

projectsRouter.get("/", (req, res) => {
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
    res.status(200).send(projects);
  });
});

projectsRouter.get("/:projectId", (req, res) => {
  const projectId = req.params.projectId;

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
    let project = projects.find((u) => u.id == projectId);
    res.status(200).send(project);
  });
});

projectsRouter.post("/", (req, res) => {
  const postedProject = req.body;

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

    projects.push(postedProject);

    fs.writeFile(
      "projects.json",
      JSON.stringify(projects, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to file");
          return res.status(500).send("Internal server error");
        }

        res.status(200).send({
          message: "Project posted",
        });
      }
    );
  });
});

projectsRouter.put("/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const updatedProject = req.body;

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

    const projectIndex = projects.findIndex((u) => u.id == projectId);
    if (projectIndex === -1) {
      return res.status(404).send({ message: "Project not found" });
    }

    projects[projectIndex] = { ...projects[projectIndex], ...updatedProject };

    fs.writeFile(
      "projects.json",
      JSON.stringify(projects, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Cannot update project");
          return res.status(500).send("Internal server error");
        }
        return res.status(200).send({ message: "Project updated" });
      }
    );
  });
});

module.exports = projectsRouter;

const express = require("express");
const usersRouter = express.Router();
const fs = require("fs");

usersRouter.get("/", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      return res.status(500).send("Internal server error");
    }

    res.status(200).send(users);
  });
});

usersRouter.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      return res.status(500).send("Internal server error");
    }

    const user = users.find((u) => u.id == userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  });
});

usersRouter.post("/", (req, res) => {
  let newUser = req.body;

  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      if (data.trim() !== "") {
        return res.status(500).send("Internal server error");
      }
    }

    users.push(newUser);

    fs.writeFile("users.json", JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Cannot add user");
        return res.status(500).send("Internal server error");
      }
      return res.status(201).send({ message: "User created" });
    });
  });
});

usersRouter.delete("/:userId", (req, res) => {
  const userId = req.params.userId;
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      return res.status(500).send("Internal server error");
    }
    const filteredUsers = users.filter((u) => u.id != userId);

    console.log(filteredUsers);
    fs.writeFile(
      "users.json",
      JSON.stringify(filteredUsers, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Cannot delete user");
          return res.status(500).send("Internal server error");
        }
        return res.status(200).send({ message: "User deleted" });
      }
    );
  });
});

usersRouter.put("/:userId", (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;

  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON data");
      return res.status(500).send("Internal server error");
    }

    const userIndex = users.findIndex((u) => u.id == userId);
    if (userIndex === -1) {
      return res.status(404).send({ message: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };

    fs.writeFile("users.json", JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Cannot update user");
        return res.status(500).send("Internal server error");
      }
      return res.status(200).send({ message: "User updated" });
    });
  });
});

module.exports = usersRouter;

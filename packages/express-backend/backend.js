import express from "express";
import cors from "cors";
import userService from "./services/user-service";

const app = express();
const port = 8000;

const generateId = () => {
  return Math.round(Math.random() * 10000).toString();
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name !== undefined && job !== undefined) {
    // Find users by both name and job
    let result = userService.findUser(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name !== undefined) {
    // Find users by name only
    let result = userService.findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else if (job !== undefined) {
    let result = userService.findUserByJob(job);
    result = { users_list: result };
  } else {
    res.send(users)
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = userService.findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  console.log(id)
  console.log(users)
  let result = userService.findUserById(id)
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    userService.deleteUser(result);
    res.status(204).send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = {id: generateId(), ...req.body};
  let user = userService.addUser(userToAdd);
  /* making sure to send a 201 on successful creation */
  res.status(201).send(user);
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});


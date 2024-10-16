import express from "express";
import cors from "cors";

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const app = express();
const port = 8000;

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};
const findUserByJob = (job) => {
  return users["users_list"].filter((user) => user["job"] === job);
};
const findUserById = (id) => {
  return users["users_list"].find((user) => user["id"] === id);
};
const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};
const deleteUser = (user) => {
  users["users_list"] = users["users_list"].filter((bleh) => bleh !== user);
}
const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

const generateId = () => {
  return Math.random() * 10000
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
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name !== undefined) {
    // Find users by name only
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else if (job !== undefined) {
    let result = findUserByJob(job);
    result = { users_list: result };
  } else {
    res.send(users)
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id)
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    deleteUser(result);
    res.status(204).send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateId()
  addUser(userToAdd);
  res.status(201).send();
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});


import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const {MONGO_CONNECTION_STRING} = process.env;

console.log(MONGO_CONNECTION_STRING);

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

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
    userService
      .findUserByNameAndJob(name, job)
      .then((result) => {
        userService.findUserByJob(job)
          res.send({ users_list: result });
        })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error finding users by name and job")
      });
  } else if (name !== undefined) {
    // Find users by name only
    userService
      .findUserByName(name)
      .then((result) => {
        res.send({ users_list: result });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error finding users by name")
      });
  } else if (job !== undefined) {
    userService.findUserByJob(job)
      .then((result) => {
        res.send({ users_list: result });
      })
      .catch((error) => res.status(500).send("Error finding users by job"));
  } else {
    userService
      .getUsers()
      .then((result) => {
        res.send({ users_list: result });
      })
      .catch((error) => res.status(500).send("Error fetching all users"));
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];

  userService
    .findUserById(id)
    .then((result) => {
      console.log("bleh")
      if (result === null) {
        console.log("thingamabob");
        res.status(404).send("User not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching user by ID")
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  console.log(id)
 userService
   .deleteUserById(id)
   .then((result) => {
     if (!result) {
       res.status(404).send("User not found.");
     } else {
       res.status(204).send();
     }
   })
   .catch((error) => {
     console.error(error);
     res.status(500).send("Error deleting user");
   });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService
    .addUser(userToAdd)
    .then((user) => {
      res.status(201).send(user); // 201 on successful creation
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error creating user")
    });
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        } else {
          console.log(`Failed to add user, status code: ${response.status}`);
        }
      })
      .then((user) => setCharacters([...characters, user]))
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteUser(id) {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
  }

  function removeOneCharacter(index) {
    const id = characters[index].id;
    console.log(id);
    deleteUser(id).then((res) => {
      if (res.status === 204) {
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
        console.log("Success!");
      } else  if (res.status === 404){
        console.log("that doesn't exist...");
      } else {
        console.log("That didn't work...");
      }
    })
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;

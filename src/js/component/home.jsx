import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const user = "sebas";
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);

  async function fetchData(event) {
    if (event.key === "Enter" && inputValue) {
      setTasks([...tasks, { done: false, label: inputValue }]);
      setInputValue("");
    }
  }

  const deleteData = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  useEffect(() => {
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${user}`, {
      method: "PUT",
      body: JSON.stringify(tasks),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, [tasks]);

  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        const response = await fetch(
          `https://playground.4geeks.com/apis/fake/todos/user/${user}`
        );

        if (!response.ok) {
          alert(
            `Error status is: ${response.status} ${
              response.status === 404
                ? `: The user "${user}" doesn't exist`
                : ""
            }`
          );
        } else {
          const responseJson = await response.json();
          setTasks(responseJson);
        }
      } catch (error) {
        console.error(error);
        fetch(`https://playground.4geeks.com/apis/fake/todos/user/${user}`, {
          method: "POST",
          body: JSON.stringify([]),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    };

    fetchTaskList();
  }, [user]);

  return (
    <>
      <div>
        <h1 className="text-center">Todo List</h1>
        <ul>
          <li>
            <input
              type="text"
              onChange={(event) => setInputValue(event.target.value)}
              onKeyUp={fetchData}
              value={inputValue}
              placeholder="Write new task here"
            />
          </li>
          {tasks.map((item, index) => (
            <li
              className="d-flex justify-content-between"
              key={`tasks${index}`}
            >
              <div>{item.label}</div>
              <div className="icon-delete">
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ color: "#ff0000" }}
                  onClick={() => deleteData(index)}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-between">
          <div>
            {tasks.length === 0
              ? "No tasks pending"
              : `${tasks.length} ${
                  tasks.length === 1 ? "task" : "tasks"
                } pending`}
          </div>
          <button onClick={deleteAllTasks}>Delete All</button>
        </div>
      </div>
    </>
  );
};

export default Home;

import inquirer from "inquirer";
import fs from "fs";

function addNewUser() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "Name",
        message: "Enter the user's name. To cancel press ENTER:",
      },
    ])
    .then((answer) => {
      if (answer.Name !== "") {
        inquirer
          .prompt([
            {
              type: "number",
              name: "Age",
              message: "Enter your age:",
            },
            {
              type: "list",
              name: "Gender",
              message: "Choose your gender:",
              choices: ["Male", "Female"],
            },
          ])
          .then((answers) => {
            let user = Object.assign(answer, answers);

            fs.readFile("db.txt", "utf-8", (error, data) => {
              if (error) {
                console.log("Error while writing data to File");
              }
              let content = [user];
              if (data !== "") {
                content = content.concat(JSON.parse(data));
              }
              fs.writeFile(
                "db.txt",
                JSON.stringify(content),
                "utf-8",
                function (error) {
                  if (error) {
                    console.log("Error while writing data to File");
                  }
                }
              );
            });
            addNewUser();
          });
      } else {
        inquirer
          .prompt([
            {
              name: "SearchChoice",
              type: "list",
              message: "Would you search values in DB?",
              choices: ["Yes", "No"],
            },
          ])
          .then(function (question) {
            if (question.SearchChoice === "Yes") {
              fs.readFile("db.txt", "utf-8", (error, data) => {
                data = JSON.parse(data);
                console.log(data);
                if (error) {
                  console.log("Error while writing data to File");
                }
                data = JSON.parse(data);
                console.log(data);
              });
              inquirer
                .prompt([
                  {
                    name: "NameSearch",
                    type: "input",
                    message: "Enter user's name you wanna find in DB:",
                  },
                ])
                .then(function (filter) {
                  fs.readFile("db.txt", "utf-8", (error, data) => {
                    if (error) {
                      console.log("Error while writing data to File");
                    }
                    data = JSON.parse(data);
                    let found = [];
                    for (let i = 0; i < data.length; i++) {
                      if (
                        data[i].Name.toLowerCase().includes(
                          filter.NameSearch.toLowerCase()
                        )
                      ) {
                        found.push(data[i]);
                      }
                    }
                    if (JSON.stringify(found) === "[]") {
                      console.log(
                        "Looks like there's no one in the system with that name"
                      );
                    } else {
                      console.log(found);
                    }
                  });
                });
            } else {
              process.exit(123);
            }
          });
      }
    });
}
addNewUser();
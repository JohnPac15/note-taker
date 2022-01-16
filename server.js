const fs = require("fs");
const path = require("path");

const notes = require("./db/db.json");

const express = require("express");
const database = require("mime-db");
const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    return res.json(notes);
  });
  //   let results = notes;
});

app.post("/api/notes", (req, res) => {
  console.log(req.body);
  // deconstructed the req.body
  const { title, text } = req.body;
  //made a new note with the information from req.body
  const newNote = {
    title,
    text,
  };

  //reading what is currently on the db.json file
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) throw err;

    //covert data from the db.json file from a string into JSON object
    console.log("readfile 1", data);
    const parseData = JSON.parse(data);
    console.log("readfile 2", parseData[0]);

    //add the new noteNote we made above to the db.json array
    parseData.push(newNote);
    console.log("readfile 3", parseData);

    // adds a id to each new note
    parseData.forEach((item, i) => {
      item.id = i + 0;
    });
    console.log("readfile add id", parseData);

    //turn all the new data into a string for write file to work
    const stringNote = JSON.stringify(parseData);
    console.log("readfile 4", stringNote);

    // write the updates notes back to the file
    fs.writeFile("./db/db.json", stringNote, (writeErr) =>
      writeErr
        ? console.error(writeErr)
        : console.log("updated note successfully")
    );
  });
});

app.delete(`/api/notes/:number`, (req, res) => {

  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    //the is the db.json file in a Object format
    const parseData = JSON.parse(data);

    //this is the id number of the note I want to delete
    const indexId = req.params.number;

    //this is the parsed version of the id of the note i want to delete
    const x = JSON.parse(indexId);
    console.log(x, 'delete 1', parseData)

    //this is going to delete the note from the db.json Object
    let spliceSelectedIndex = parseData.splice(x, 1);
    console.log(spliceSelectedIndex, "delete 2", parseData)

    // I need to reassign the Ids to each of the remaining notes
    parseData.forEach((item, i) => {
      item.id = i + 0;
    });
    console.log('delete 4',parseData)

    // turn all the new data into a string for write file to work
    const stringNote = JSON.stringify(parseData);
    console.log("delete 5", stringNote);
    

    // write the updates notes back to the file
    fs.writeFile("./db/db.json", stringNote, (writeErr) =>
      writeErr
        ? console.error(writeErr)
        : console.log("deleted note successfully"),
    );
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});

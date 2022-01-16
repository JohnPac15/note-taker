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

const writeFile = function (stringData) {
  // write the updates notes back to the file
  fs.writeFile("./db/db.json", stringData, (writeErr) =>
    writeErr
      ? console.error(writeErr)
      : console.log("---updated note successfully---")
  );
};

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const noteParse = JSON.parse(data)
    console.log('---GET 1---', noteParse)
    if (noteParse == []) {
      console.log('---GET 2---', noteParse)
      return res.json(noteParse);
    } else {
      if (err) {
        throw err;
      } else {
        console.log('---GET 3---', noteParse)
        return res.json(noteParse);
      }
    }
  });
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
    const parseData = JSON.parse(data);

    console.log("---readfile 1---", data);
    if (data == []) {
      //add the new noteNote we made above to the db.json array
      parseData.push(newNote);
      console.log("---readfile 2 if data = []---", parseData);

      // adds a id to each new note
      parseData.forEach((item, i) => {
        item.id = i;
      });
      console.log("---readfile 3 add id---", parseData);

      const stringNote = JSON.stringify(parseData);
      console.log("---readfile 4---", stringNote);

      return writeFile(stringNote);

    } else {

      console.log("---readfile 5---", parseData);

      //add the new noteNote we made above to the db.json array
      parseData.push(newNote);
      console.log("---readfile 6---", parseData);

      // adds a id to each new note
      parseData.forEach((item, i) => {
        item.id = i;
      });
      console.log("---readfile 7 add id ---", parseData);

      //turn all the new data into a string for write file to work
      const stringNote = JSON.stringify(parseData);
      console.log("---readfile 8 ---", stringNote);
      return writeFile(stringNote);
    }
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
    console.log(x, "---delete 1---", parseData);

    //this is going to delete the note from the db.json Object
    let spliceSelectedIndex = parseData.splice(x, 1);
    console.log(spliceSelectedIndex, "---delete 2---", parseData);

    if(parseData === []) {
      console.log('---detele 3---', parseData)
      return writeFile(parseData)
    } 
    else {
      // I need to reassign the Ids to each of the remaining notes
      parseData.forEach((item, i) => {
        item.id = i;
      });
      console.log("---delete 4---", parseData);
  
      // turn all the new data into a string for write file to work
      const stringNote = JSON.stringify(parseData);
      console.log("---delete 5---", stringNote);

      return writeFile(stringNote)
    }
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

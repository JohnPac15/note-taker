const fs = require("fs");
const path = require("path");

const express = require("express");
const database = require("mime-db");
const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use(express.static("public"));
// const notes = require("./db/db");

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    // console.log(notes, "sup");
    return res.json(notes);
  });
  //   let results = notes;
});

app.post("/api/notes", (req, res) => {
  console.log(req.body)

  const {title, text} = req.body

  const newNote = {
    title,
    text
  }
    
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if(err) throw err
    //covert data from string into JSON object
    console.log('readfile 1', data)
    const parseData = JSON.parse(data)
    console.log('readfile 2',parseData)
    //add the new note
    // const noteArray = []
    // noteArray.push(parseData)
    parseData.push(newNote)
    console.log('readfile 3',parseData)
    //turn all the new data into a string for write file to work
    const stringNote = JSON.stringify(parseData)
    console.log('readfile 4'),stringNote


    // write the updates notes back to the file
    fs.writeFile(
      './db/db.json',
        stringNote, 
        (writeErr) => writeErr
          ? console.error(writeErr)
          : console.log("updated note successfully"),
    )

  }) 
  res.json()
})


// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});

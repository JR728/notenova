const express = require('./develop/node_modules/express');
const fs = require('fs');
const path  = require('path');

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('develop/public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('./develop/db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile('./develop/db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      newNote.id = notes.length + 1; // Assign a simple unique ID
      notes.push(newNote);
      fs.writeFile('./develop/db/db.json', JSON.stringify(notes), 'utf8', (err) => {
        if (err) throw err;
        res.json(newNote);
      });
    });
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
  
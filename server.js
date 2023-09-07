const express = require('express');
const fs = require('fs');
const path  = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      newNote.id = notes.length + 1; // Assign a simple unique ID
      notes.push(newNote);
      fs.writeFile('./db/db.json', JSON.stringify(notes), 'utf8', (err) => {
        if (err) throw err;
        res.json(newNote);
      });
    });
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.delete('/api/notes/:id', (req, res) => {
    const noteIdToDelete = parseInt(req.params.id);
  
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
  
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter(note => note.id !== noteIdToDelete);
  
      fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), 'utf8', err => {
        if (err) throw err;
  
        res.json({ message: `Note with ID ${noteIdToDelete} deleted successfully` });
      });
    });
});
  

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
  
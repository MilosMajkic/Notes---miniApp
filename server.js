const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serviranje statičkih fajlova (UI)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware za automatsko dekodovanje URL-a (za Unicode karaktere)
app.use((req, res, next) => {
  // Dekoduj URL ako je enkodovan
  try {
    const decodedUrl = decodeURIComponent(req.url);
    if (decodedUrl !== req.url) {
      req.url = decodedUrl;
      req.originalUrl = decodedUrl;
    }
  } catch (e) {
    // Ako dekodovanje ne uspe, koristi originalni URL
  }
  console.log(`${req.method} ${req.url}`);
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Pomoćne funkcije
async function readNotes() {
  try {
    const filePath = path.join(__dirname, 'notes.json');
    const data = await fs.readFile(filePath, 'utf8');
    
    if (!data.trim()) {
      return [];
    }
    
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(path.join(__dirname, 'notes.json'), '[]', 'utf8');
      return [];
    }
    throw error;
  }
}

async function writeNotes(notes) {
  if (!Array.isArray(notes)) {
    throw new Error('Parametar mora biti niz');
  }
  
  const filePath = path.join(__dirname, 'notes.json');
  const jsonData = JSON.stringify(notes, null, 2);
  
  await fs.writeFile(filePath, jsonData, 'utf8');
}

// POST /beleške - Kreiranje nove beleške
app.post('/beleške', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        error: 'Title i content su obavezni'
      });
    }
    
    const notes = await readNotes();
    const id = Date.now().toString();
    
    const newNote = {
      id: id,
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    await writeNotes(notes);
    
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Greška pri kreiranju beleške:', error);
    res.status(500).json({ error: 'Interna greška servera' });
  }
});

// GET /beleške - Čitanje svih beleški
app.get('/beleške', async (req, res) => {
  try {
    const notes = await readNotes();
    res.status(200).json(notes);
  } catch (error) {
    console.error('Greška pri čitanju beleški:', error);
    res.status(500).json({ error: 'Interna greška servera' });
  }
});

// GET /beleške/:id - Čitanje jedne beleške
app.get('/beleške/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await readNotes();
    const note = notes.find(n => n.id === id);
    
    if (!note) {
      return res.status(404).json({
        error: 'Beleška sa datim ID-jem nije pronađena'
      });
    }
    
    res.status(200).json(note);
  } catch (error) {
    console.error('Greška pri čitanju beleške:', error);
    res.status(500).json({ error: 'Interna greška servera' });
  }
});

// PUT /beleške/:id - Ažuriranje beleške
app.put('/beleške/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        error: 'Title i content su obavezni'
      });
    }
    
    const notes = await readNotes();
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      return res.status(404).json({
        error: 'Beleška sa datim ID-jem nije pronađena'
      });
    }
    
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title,
      content: content,
      updatedAt: new Date().toISOString()
    };
    
    await writeNotes(notes);
    res.status(200).json(notes[noteIndex]);
  } catch (error) {
    console.error('Greška pri ažuriranju beleške:', error);
    res.status(500).json({ error: 'Interna greška servera' });
  }
});

// DELETE /beleške/:id - Brisanje beleške
app.delete('/beleške/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await readNotes();
    const initialLength = notes.length;
    const filteredNotes = notes.filter(n => n.id !== id);
    
    if (filteredNotes.length === initialLength) {
      return res.status(404).json({
        error: 'Beleška sa datim ID-jem nije pronađena'
      });
    }
    
    await writeNotes(filteredNotes);
    res.status(200).json({
      message: 'Beleška je uspešno obrisana',
      id: id
    });
  } catch (error) {
    console.error('Greška pri brisanju beleške:', error);
    res.status(500).json({ error: 'Interna greška servera' });
  }
});

// Pokretanje servera
app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
  console.log(`API dostupan na: http://localhost:${PORT}/beleške`);
});


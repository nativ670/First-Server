const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const CONTACTS_FILE = path.join(__dirname, 'contacts.json');
const BOOKMARKS_FILE = path.join(__dirname, 'bookmarks.json');

app.get('/about', (req, res) => {
  res.send('This is the about page. I built this server myself!');
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Bookmarks API
app.get('/api/bookmarks', (req, res) => {
  if (!fs.existsSync(BOOKMARKS_FILE)) {
    return res.json([]);
  }
  try {
    const data = fs.readFileSync(BOOKMARKS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading bookmarks file:', err);
    res.status(500).json({ error: 'Failed to read bookmarks' });
  }
});

app.post('/api/bookmarks', (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Name and URL are required' });
  }

  let bookmarks = [];
  if (fs.existsSync(BOOKMARKS_FILE)) {
    try {
      const data = fs.readFileSync(BOOKMARKS_FILE, 'utf8');
      bookmarks = JSON.parse(data);
    } catch (err) {
      console.error('Error reading bookmarks file:', err);
    }
  }

  const newBookmark = { name, url };
  bookmarks.push(newBookmark);

  try {
    fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2));
    res.status(201).json(newBookmark);
  } catch (err) {
    console.error('Error writing bookmarks file:', err);
    res.status(500).json({ error: 'Failed to save bookmark' });
  }
});

app.delete('/api/bookmarks', (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!fs.existsSync(BOOKMARKS_FILE)) {
    return res.status(404).json({ error: 'No bookmarks found' });
  }

  try {
    const data = fs.readFileSync(BOOKMARKS_FILE, 'utf8');
    let bookmarks = JSON.parse(data);
    const initialLength = bookmarks.length;
    bookmarks = bookmarks.filter(b => b.url !== url);

    if (bookmarks.length === initialLength) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2));
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    console.error('Error processing delete:', err);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Server-side validation
  const errors = {};
  if (!name || name.trim() === '') errors.name = 'Name is required';
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Invalid email format';
  }

  if (!message || message.trim() === '') errors.message = 'Message is required';

  if (Object.keys(errors).length > 0) {
    return res.status(400).send(`<h1>Validation Error</h1><ul>${Object.values(errors).map(err => `<li>${err}</li>`).join('')}</ul><a href="/contact">Go back</a>`);
  }

  const newContact = {
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };

  // Read existing contacts, or start with empty array
  let contacts = [];
  if (fs.existsSync(CONTACTS_FILE)) {
    try {
      const data = fs.readFileSync(CONTACTS_FILE, 'utf8');
      contacts = JSON.parse(data);
    } catch (err) {
      console.error('Error reading contacts file:', err);
    }
  }

  // Add new contact and save
  contacts.push(newContact);
  
  try {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    console.log(`Saved contact form submission from ${name}`);
    res.send(`<h1>Thank you, ${name}!</h1><p>Your message has been received and saved.</p><a href="/">Go back home</a>`);
  } catch (err) {
    console.error('Error writing contacts file:', err);
    res.status(500).send('<h1>Server Error</h1><p>Sorry, we could not save your message.</p><a href="/contact">Try again</a>');
  }
});

app.get('/api/time', (req, res) => {
  res.json({
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString()
  });
});

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'Guest';
  res.json({
    message: `Hello, ${name}! Welcome to my server!`
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/about', (req, res) => {
  res.send('This is the about page. I built this server myself!');
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
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
    // In a real app, you might re-render the form with error messages
    // For now, we'll send a simple error response
    return res.status(400).send(`<h1>Validation Error</h1><ul>${Object.values(errors).map(err => `<li>${err}</li>`).join('')}</ul><a href="/contact">Go back</a>`);
  }

  console.log(`Received contact form submission:`, { name, email, message });
  
  // Here you would normally save to a database or send an email
  res.send(`<h1>Thank you, ${name}!</h1><p>Your message has been received.</p><a href="/">Go back home</a>`);
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
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load common passwords
const commonPasswords = new Set(
  fs.readFileSync('10-million-password-list-top-1000.txt', 'utf8')
    .split('\n')
    .map(p => p.trim())
);

// Password validation function (OWASP C6 Level 1)
function validatePassword(password) {
  // Minimum 8 characters
  if (password.length < 8) return false;
  
  // Block common passwords
  if (commonPasswords.has(password)) return false;
  
  // At least one uppercase, one lowercase, one number
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  
  return true;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
  const { password } = req.body;
  
  if (validatePassword(password)) {
    res.send(`
      <html>
        <body>
          <h1>Welcome!</h1>
          <p>Your password: ${password}</p>
          <form action="/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </body>
      </html>
    `);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.post('/logout', (req, res) => {
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
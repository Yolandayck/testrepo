const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load common passwords from local file
let commonPasswords = new Set();
try {
  const passwords = fs.readFileSync('common-passwords.txt', 'utf8')
    .split('\n')
    .map(p => p.trim().toLowerCase())
    .filter(p => p.length > 0);
  commonPasswords = new Set(passwords);
  console.log(`Loaded ${commonPasswords.size} common passwords`);
} catch (err) {
  console.error('Error loading common passwords file:', err);
}

// Password validation function (OWASP C6 Level 1)
function validatePassword(password) {
  // Minimum 8 characters
  if (password.length < 8) {
    console.log('Password too short');
    return false;
  }
  
  // Block common passwords (case insensitive)
  if (commonPasswords.has(password.toLowerCase())) {
    console.log('Password found in common passwords list');
    return false;
  }
  
  // At least one uppercase, one lowercase, one number
  if (!/[A-Z]/.test(password)) {
    console.log('Missing uppercase letter');
    return false;
  }
  if (!/[a-z]/.test(password)) {
    console.log('Missing lowercase letter');
    return false;
  }
  if (!/[0-9]/.test(password)) {
    console.log('Missing number');
    return false;
  }
  
  return true;
}

// Routes remain the same as before
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
          <p>Your password meets all security requirements</p>
          <form action="/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </body>
      </html>
    `);
  } else {
    res.send(`
      <html>
        <body>
          <h1>Password Validation</h1>
          <p style="color: red;">Password does not meet requirements. Please try again.</p>
          <form action="/login" method="post">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Login</button>
          </form>
          <p>Password must:</p>
          <ul>
            <li>Be at least 8 characters long</li>
            <li>Contain at least one uppercase letter</li>
            <li>Contain at least one lowercase letter</li>
            <li>Contain at least one number</li>
            <li>Not be a common password</li>
          </ul>
        </body>
      </html>
    `);
  }
});

app.post('/logout', (req, res) => {
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
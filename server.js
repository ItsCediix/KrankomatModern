const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

// Serve specific directories and files safely
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
// Serve specific files needed (like Terms)
app.get('/NUTZUNGSBEDINGUNGEN.txt', (req, res) => res.sendFile(path.join(__dirname, 'NUTZUNGSBEDINGUNGEN.txt')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

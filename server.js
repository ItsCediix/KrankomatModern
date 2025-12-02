const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'configs/')
    },
    filename: function (req, file, cb) {
        // Simple sanitization to prevent path traversal in filename during upload
        const safeName = path.basename(file.originalname);
        cb(null, safeName)
    }
});
const upload = multer({ storage: storage });

app.use(express.json());

// Serve specific directories and files safely
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
// Serve specific files needed (like Terms)
app.get('/NUTZUNGSBEDINGUNGEN.txt', (req, res) => res.sendFile(path.join(__dirname, 'NUTZUNGSBEDINGUNGEN.txt')));

// API: List configs
app.get('/api/configs', (req, res) => {
    const configDir = path.join(__dirname, 'configs');
    fs.readdir(configDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to list configs' });
        }

        // Filter for JSON files and match pattern [Name]_config.json
        const configs = files
            .filter(file => file.endsWith('_config.json'))
            .map(file => {
                const name = file.replace('_config.json', '');
                return { name: name, filename: file };
            });

        res.json(configs);
    });
});

// API: Get specific config
app.get('/api/configs/:filename', (req, res) => {
    const filename = req.params.filename;
    // Prevent path traversal
    const safeFilename = path.basename(filename);
    const filepath = path.join(__dirname, 'configs', safeFilename);

    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).json({ error: 'Config not found' });
    }
});

// API: Upload config
app.post('/api/configs', upload.single('config'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

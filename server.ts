import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { Server } from 'socket.io';
import http from 'http';

const db = new Database('app.db');

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json({ limit: '50mb' }));

app.get('/api/data', (req, res) => {
  try {
    const pagesRow = db.prepare('SELECT value FROM store WHERE key = ?').get('pages') as { value: string } | undefined;
    const themeRow = db.prepare('SELECT value FROM store WHERE key = ?').get('theme') as { value: string } | undefined;
    
    res.json({
      pages: pagesRow ? JSON.parse(pagesRow.value) : null,
      theme: themeRow ? JSON.parse(themeRow.value) : null,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/data', (req, res) => {
  try {
    const { pages, theme } = req.body;
    
    const stmt = db.prepare('INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)');
    
    db.transaction(() => {
      if (pages) stmt.run('pages', JSON.stringify(pages));
      if (theme) stmt.run('theme', JSON.stringify(theme));
    })();
    
    // Broadcast the update to all connected clients
    io.emit('data_updated', { pages, theme });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

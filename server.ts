import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Server } from 'socket.io';
import http from 'http';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA1SWtduxdxobWs5vWHf4s0MlY8TdWeHg",
  authDomain: "ebook-a6601.firebaseapp.com",
  databaseURL: "https://ebook-a6601-default-rtdb.firebaseio.com",
  projectId: "ebook-a6601",
  storageBucket: "ebook-a6601.firebasestorage.app",
  messagingSenderId: "313272644283",
  appId: "1:313272644283:web:447c0dbe0495b8650faf9e",
  measurementId: "G-H2KJRV3V8Y"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json({ limit: '50mb' }));

app.get('/api/data', async (req, res) => {
  try {
    // Prevent CDN and browser caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const pagesSnapshot = await get(ref(db, 'store/pages'));
    const themeSnapshot = await get(ref(db, 'store/theme'));
    
    let pages = pagesSnapshot.exists() ? JSON.parse(pagesSnapshot.val()) : null;
    let theme = themeSnapshot.exists() ? JSON.parse(themeSnapshot.val()) : null;

    res.json({ pages, theme });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const { pages, theme } = req.body;
    
    if (pages) {
      await set(ref(db, 'store/pages'), JSON.stringify(pages));
    }
    if (theme) {
      await set(ref(db, 'store/theme'), JSON.stringify(theme));
    }
    
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

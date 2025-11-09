const express = require('express');
const cors = require('cors');
const http = require('http');          // <-- wichtig
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

// HTTP-Server aus Express-App erstellen
const server = http.createServer(app);

// Socket.IO-Server initialisieren
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // dein Frontend-Port
        methods: ['GET', 'POST']
    }
});

let orders = [];

// 📦 Neue Bestellung
app.post('/orders', (req, res) => {
    const { item, quantity } = req.body;
    if (!item || !quantity) return res.status(400).json({ error: 'Artikel und Anzahl erforderlich' });

    const order = {
        id: orders.length + 1,
        item,
        quantity,
        status: 'neu'
    };
    orders.push(order);

    // 👉 Broadcast an alle verbundenen Clients
    io.emit('new-order', order);

    res.json({ message: 'Bestellung aufgenommen', order });
});

// 📋 Alle Bestellungen
app.get('/orders', (req, res) => res.json(orders));

// Verbindung testen
io.on('connection', (socket) => {
    console.log('🔌 Ein Client ist verbunden');
    socket.on('disconnect', () => console.log('❌ Client getrennt'));
});

const PORT = 3000;
server.listen(PORT, () => console.log(`✅ Server läuft auf http://localhost:${PORT}`));

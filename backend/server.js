// server.js
require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

// PostgreSQL-Verbindung
const pool = new Pool({
    connectionString: process.env.DB_URL
});

// Middleware
app.use(express.json());

// Test-Route
app.get('/', (req, res) => {
    res.send('CelerServus Backend läuft!');
});

// WebSocket-Events
io.on('connection', (socket) => {
    console.log(`Client verbunden: ${socket.id}`);

    // Beispiel: Neue Bestellung erhalten
    socket.on('new_order', (order) => {
        console.log('Neue Bestellung:', order);
        io.emit('order_received', order);
    });

    socket.on('disconnect', () => {
        console.log(`Client getrennt: ${socket.id}`);
    });
});

// Server starten
const PORT = process.env.WS_PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

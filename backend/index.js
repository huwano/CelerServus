const express = require('express');
const cors = require('cors');
const http = require('http');          // <-- wichtig
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const session = require('express-session');

app.set("trust proxy", 1);

app.use(
    session({
        name: "sid",
        secret: process.env.SESSION_SECRET || "dev-secret-change-this",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // true, wenn HTTPS verwendet wird
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24, // 1 Tag
        },
    }));

app.get("/api/me", (req, res) => {
    if (!req.session.user) return res.status(401).json({ user: null });
    res.json({ user: req.session.user });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    // TODO später: aus MariaDB + Passwort-Hash prüfen
    const demoUsers = [
        { id: 1, username: "kellner1", password: "test123", role: "waiter" },
        { id: 2, username: "kueche1",  password: "test123", role: "kitchen" },
        { id: 3, username: "admin1",   password: "test123", role: "admin" },
    ];

    const user = demoUsers.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Session "initialisieren" => jetzt wird auch das Cookie gesetzt
    req.session.user = { id: user.id, username: user.username, role: user.role };

    res.json({ user: req.session.user });
});

app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("sid");
        res.json({ ok: true });
    });
});


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

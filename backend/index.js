const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());           // erlaubt Cross-Origin Requests vom Frontend
app.use(express.json());   // damit req.body JSON enthält

// temporärer Speicher für Bestellungen
let orders = [];

// Route: neue Bestellung anlegen
app.post('/orders', (req, res) => {
    const { item, quantity } = req.body;

    if (!item || !quantity) {
        return res.status(400).json({ error: 'Artikel und Anzahl erforderlich' });
    }

    const order = {
        id: orders.length + 1,
        item,
        quantity,
        status: 'neu'
    };

    orders.push(order);

    console.log('Neue Bestellung:', order);
    res.json({ message: 'Bestellung aufgenommen', order });
});

// Route: alle Bestellungen abrufen
app.get('/orders', (req, res) => {
    res.json(orders);
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend läuft auf http://localhost:${PORT}`);
});

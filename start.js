const express = require('express');
const cors = require('cors');
const path = require('path');
//const db = require('/Users/johnathenwigfall/Desktop/Grocery-Project-DS-3870/grocery.db'); // Assuming db.js exports a configured SQLite database instance

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all items
app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Initialize SQLite database
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./grocery.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});



// Get cart items
app.get('/api/cart', (req, res) => {
    db.all(`
        SELECT cart.id, cart.quantity, items.* 
        FROM cart 
        JOIN items ON cart.item_id = items.id
    `, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add item to cart
app.post('/api/cart', (req, res) => {
    const { itemId, quantity } = req.body;
    db.run(`
        INSERT INTO cart (item_id, quantity) 
        VALUES (?, ?)
    `, [itemId, quantity], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID });
        }
    });
});

// Process purchase
app.post('/api/purchase', (req, res) => {
    db.run('DELETE FROM cart', [], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Purchase successful' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
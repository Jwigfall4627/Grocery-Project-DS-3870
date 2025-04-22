const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../grocery.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite3:', err.message);
    } else {
        console.log('Connected to the grocery SQLite database.');
    }
});

// Create tables
db.serialize(() => {
    // Items table
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT NOT NULL
        )
    `);

    // Cart table
    db.run(`
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER,
            quantity INTEGER DEFAULT 1,
            FOREIGN KEY(item_id) REFERENCES items(id)
        )
    `);

    // Check if items table is empty
    db.get('SELECT COUNT(*) as count FROM items', [], (err, row) => {
        if (err) {
            console.error(err);
            return;
        }
        
        if (row.count === 0) {
            // Insert sample data
            const sampleItems = [
                ['Apples', 1.99, '/images/apples.jpg'],
                ['Bread', 2.49, '/images/bread.jpg'],
                ['Milk', 3.99, '/images/milk.jpg']
            ];

            const insert = db.prepare('INSERT INTO items (name, price, image) VALUES (?, ?, ?)');
            sampleItems.forEach(item => insert.run(item));
            insert.finalize();
            
            console.log('Sample data inserted successfully');
        }
    });
});

module.exports = db;
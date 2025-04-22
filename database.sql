const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '/Users/johnathenwigfall/Desktop/Grocery-Project-DS-3870/grocery.db'), (err) => {
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

    // Insert sample data
    const sampleItems = [
        ['Fresh Bananas', 0.99, '/images/bananas.jpg'],
        ['Whole Milk (1 Gallon)', 3.99, '/images/milk.jpg'],
        ['White Bread', 2.49, '/images/bread.jpg'],
        ['Organic Eggs (12-pack)', 4.99, '/images/eggs.jpg'],
        ['Red Apples (1lb)', 1.99, '/images/apples.jpg'],
        ['Chicken Breast (1lb)', 5.99, '/images/chicken.jpg'],
        ['Ground Beef (1lb)', 6.99, '/images/ground-beef.jpg'],
        ['Cheddar Cheese (8oz)', 3.99, '/images/cheese.jpg'],
        ['Fresh Tomatoes (1lb)', 2.49, '/images/tomatoes.jpg'],
        ['Potato Chips (Family Size)', 4.49, '/images/chips.jpg'],
        ['Orange Juice (64oz)', 4.99, '/images/orange-juice.jpg'],
        ['Carrots (1lb)', 1.49, '/images/carrots.jpg']
    ];

    const insert = db.prepare('INSERT OR IGNORE INTO items (name, price, image) VALUES (?, ?, ?)');
    sampleItems.forEach(item => insert.run(item));
    insert.finalize();
});

module.exports = db;


# Grocery Store Website Documentation

## Overview
This is a full-stack grocery store website built with Node.js, Express, SQLite3, and Bootstrap 5. It features a responsive frontend with shopping cart functionality and a backend API for managing products and orders.

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- SQLite3
- Web browser (Chrome recommended)

## Project Structure
```
Grocery-Project-DS-3870/
├── src/
│   └── database/
│       ├── init.js      # Database initialization
│       └── schema.sql   # Database schema
├── public/
│   ├── index.html      # Main HTML file
│   ├── css/
│   │   └── styles.css  # Custom styles
│   ├── js/
│   │   └── main.js     # Frontend JavaScript
│   └── images/         # Product images
├── start.js            # Server entry point
└── package.json        # Project dependencies
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Grocery-Project-DS-3870
```

2. Install dependencies:
```bash
npm install
```

3. Create the database:
```bash
mkdir -p src/database
touch src/database/grocery.db
```

## Configuration

1. Set up the database schema (src/database/schema.sql):
```sql
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY(item_id) REFERENCES items(id)
);
```

2. Configure the port in start.js:
```javascript
const PORT = process.env.PORT || 4000;
```

## Running the Application

1. Start the server:
```bash
node start.js
```

2. Open your web browser and navigate to:
```
http://localhost:4000
```

## Features

### Frontend
- Responsive product grid
- Shopping cart with real-time updates
- Quantity adjustment in cart
- Checkout functionality
- Bootstrap 5 styling

### Backend API Endpoints
- GET `/api/items` - Get all grocery items
- GET `/api/cart` - Get cart contents
- POST `/api/cart` - Add item to cart
- POST `/api/purchase` - Process purchase

## Troubleshooting

### Common Issues

1. **Port already in use**
```bash
lsof -i :4000
kill -9 <PID>
```

2. **Database connection issues**
- Check database file permissions
- Verify SQLite3 is installed
```bash
sqlite3 --version
```

3. **Images not loading**
- Ensure images are in the correct directory
- Check image paths in database

### Debugging

1. Check server logs:
```bash
node start.js | tee server.log
```

2. Monitor network requests in browser:
- Open Chrome DevTools (Cmd + Option + I)
- Go to Network tab
- Reload page

## Development

To run in development mode with auto-reload:
```bash
npm install -g nodemon
nodemon start.js
```

## License
ISC License
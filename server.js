// server.js (Temporarily Fixed for Application Loading)

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const db = require("./db"); // Expects db.js to be using mysql2/promise
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve the built React app static assets (CSS, JS, images from client/build)
app.use(express.static(path.join(__dirname, 'client/build'))); 

/* ------------------------- 📚 DATABASE UTILS ------------------------- */

// Wrapper for db.query to use async/await (using Promises from mysql2/promise)
const query = async (sql, params) => {
    // Note: This relies on the destructuring [results] which is correct for mysql2/promise.
    const [results] = await db.query(sql, params); 
    return results;
};


/* ------------------------- 📚 AUTO-SEED BOOKS ------------------------- */

async function fetchBooks(query, maxResults = 10) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    try {
        const res = await axios.get(url);
        return res.data.items ? res.data.items.map(item => {
            const info = item.volumeInfo;
            return {
                title: info.title || "Unknown Title",
                author: (info.authors && info.authors.join(", ")) || "Unknown Author",
                genre: query 
            };
        }).filter(book => book.title && book.author) : [];
    } catch (e) {
        console.error(`Google Books API failed for ${query}:`, e.message);
        return [];
    }
}

async function seedBooks() {
    const queries = ["Fiction", "Science", "History", "Technology", "Fantasy"];
    try {
        for (const genre of queries) {
            console.log(`📚 Fetching books for: ${genre}`);
            const books = await fetchBooks(genre, 10);

            for (const book of books) {
                await query(
                    "INSERT IGNORE INTO books (title, author, genre) VALUES (?, ?, ?)",
                    [book.title, book.author, genre]
                );
            }
        }
        console.log("✅ Auto-seeding complete!");
    } catch (error) {
        console.error("❌ Auto-seeding failed:", error.message);
    }
}


/* ------------------------- 🚀 API ROUTES ------------------------- */

const apiRouter = express.Router();

// 📚 Get all books (MODIFIED TO INCLUDE AVAILABILITY FILTERING)
apiRouter.get("/books", async (req, res) => {
    const { genre, available } = req.query;

    let sql = `
        SELECT
            b.id, b.title, b.author, b.genre,
            CASE WHEN bb.id IS NULL THEN 1 ELSE 0 END AS available,
            u.name AS borrowed_by, u.id AS borrowed_by_id
        FROM books b
        LEFT JOIN borrowed_books bb
            ON b.id = bb.book_id AND bb.return_date IS NULL
        LEFT JOIN users u
            ON bb.user_id = u.id
    `;
    const params = [];
    const conditions = [];

    // 1. Filter by Genre 
    if (genre) {
        conditions.push("b.genre = ?");
        params.push(genre);
    }

    // 2. Filter by Availability (NEW LOGIC)
    if (available === 'true') {
        conditions.push("bb.id IS NULL"); 
    } else if (available === 'false') {
        conditions.push("bb.id IS NOT NULL");
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY b.title";

    try {
        const results = await query(sql, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// 🎭 Get all genres
apiRouter.get("/genres", async (req, res) => {
    try {
        const results = await query("SELECT DISTINCT genre FROM books WHERE genre IS NOT NULL ORDER BY genre");
        res.json(results.map(r => r.genre));
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// ➕ Add new book
apiRouter.post("/books", async (req, res) => {
    const { title, author, genre } = req.body;
    if (!title || !author) return res.status(400).json({ error: "Title and Author are required." });
    try {
        await query("INSERT INTO books (title, author, genre) VALUES (?, ?, ?)", [title, author, genre || 'Uncategorized']);
        res.status(201).json({ message: "Book added successfully." });
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// ✏️ Update/Edit a book
apiRouter.put("/books/:id", async (req, res) => {
    const { id } = req.params;
    const { title, author, genre } = req.body;
    if (!title || !author) return res.status(400).json({ error: "Title and Author are required." });

    try {
        const sql = "UPDATE books SET title = ?, author = ?, genre = ? WHERE id = ?";
        const result = await query(sql, [title, author, genre, id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Book not found." }); 
        res.json({ message: "Book updated successfully." });
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// 🗑️ Delete a book
apiRouter.delete("/books/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await query("DELETE FROM borrowed_books WHERE book_id = ?", [id]);
        const result = await query("DELETE FROM books WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Book not found." });
        res.json({ message: "Book deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// 🔄 Borrow a book
apiRouter.post("/borrow", async (req, res) => {
    const { user_id, book_id } = req.body;
    if (!user_id || !book_id) return res.status(400).json({ error: "user_id and book_id are required." });

    try {
        const check = await query("SELECT * FROM borrowed_books WHERE book_id = ? AND return_date IS NULL", [book_id]);
        if (check.length > 0) return res.status(400).json({ error: "Book is already borrowed." });

        await query("INSERT INTO borrowed_books (user_id, book_id) VALUES (?, ?)", [user_id, book_id]);
        res.json({ message: "Book borrowed successfully." });
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// ✅ Return a book
apiRouter.post("/return", async (req, res) => {
    const { book_id } = req.body;
    if (!book_id) return res.status(400).json({ error: "book_id is required." });

    try {
        const result = await query("UPDATE borrowed_books SET return_date = NOW() WHERE book_id = ? AND return_date IS NULL", [book_id]);
        if (result.affectedRows === 0) return res.status(400).json({ error: "Book is not currently borrowed." });
        res.json({ message: "Book returned successfully." });
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// 🔍 Search books 
apiRouter.get("/search", async (req, res) => {
    const { q, available } = req.query;

    let sql = `
        SELECT b.id, b.title, b.author, b.genre,
            CASE WHEN bb.id IS NULL THEN TRUE ELSE FALSE END AS available,
            u.name AS borrowed_by
        FROM books b
        LEFT JOIN borrowed_books bb
            ON b.id = bb.book_id AND bb.return_date IS NULL
        LEFT JOIN users u
            ON bb.user_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (q) {
        conditions.push("(b.title LIKE ? OR b.author LIKE ?)");
        params.push(`%${q}%`, `%${q}%`);
    }
    if (available === "true") conditions.push("bb.id IS NULL");

    if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY b.title";

    try {
        const results = await query(sql, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

/* --------------------- 👤 MEMBER MANAGEMENT ROUTES --------------------- */

// 👤 Get users (Member list - TEMPORARILY REVERTED TO SIMPLE SELECT)
// 👤 Get users (Member list - Reverting to complex query to get clear error)
// server.js (Simplified GET /api/books for Guaranteed Filtering)

apiRouter.get("/users", async (req, res) => {
    try {
        const sql = `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.type,
                COUNT(bb.book_id) AS active_borrows  -- This calculates the count
            FROM users u
            LEFT JOIN borrowed_books bb 
                ON u.id = bb.user_id AND bb.return_date IS NULL
            GROUP BY u.id, u.name, u.email, u.type
            ORDER BY u.name;
        `;
        
        const results = await query(sql); 
        res.json(results);
    } catch (err) {
        // Log the error to ensure the connection itself is working
        console.error("DATABASE ERROR on /users:", err.message);
        res.status(500).json({ error: "DB error: Failed to retrieve member data with loan count." });
    }
});



// ➕ Add new user (Member)
apiRouter.post("/users", async (req, res) => {
    const { name, email, type } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and Email are required." });
    try {
        await query("INSERT INTO users (name, email, type) VALUES (?, ?, ?)", [name, email, type || 'Member']);
        res.status(201).json({ message: "Member added successfully." });
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// ✏️ Update a user (Member)
apiRouter.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, type } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and Email are required." });
    
    try {
        const sql = "UPDATE users SET name = ?, email = ?, type = ? WHERE id = ?";
        const result = await query(sql, [name, email, type, id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Member not found." });
        res.json({ message: "Member updated successfully." });
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// 🗑️ Delete a user (Member)
apiRouter.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // IMPORTANT: Must delete related borrowing records first!
        await query("DELETE FROM borrowed_books WHERE user_id = ?", [id]);
        
        const result = await query("DELETE FROM users WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Member not found." });
        res.json({ message: "Member deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: "DB error: " + err.message });
    }
});

// Apply the API router
app.use("/api", apiRouter);

// FINAL CATCH-ALL MIDDLEWARE: Serves React app for any non-API route.
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    } else {
        next(); 
    }
});

/* ------------------------- 🚀 START SERVER ------------------------- */
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await seedBooks(); // auto-populate books on startup
});
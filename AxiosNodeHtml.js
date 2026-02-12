const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// ✅ FIXED (http, not https)
const base_url = "http://localhost:3000";

app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "ejs");

// ✅ Modern Express body parsing (no body-parser needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));


// ================= ROUTES =================

// Home - list all books
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/books`);
        res.render('books', { books: response.data });
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// View single book
app.get("/book/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/books/' + req.params.id);
        res.render('book', { book: response.data });
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// Show create form
app.get("/create", (req, res) => {
    res.render("create");
});

// Create book
app.post("/create", async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            author: req.body.author
        };

        await axios.post(`${base_url}/books`, data);
        res.redirect("/");
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// Show update form
app.get("/update/:id", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/books/${req.params.id}`);
        res.render('update', { book: response.data });
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// Update book
app.post("/update/:id", async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            author: req.body.author
        };

        await axios.put(`${base_url}/books/${req.params.id}`, data);
        res.redirect("/");
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// Delete book
app.post("/delete/:id", async (req, res) => {
    try {
        await axios.delete(`${base_url}/books/${req.params.id}`);
        res.redirect("/");
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});


// ================= START SERVER =================

app.listen(5500, () => {
    console.log("Frontend server running on http://localhost:5500");
});

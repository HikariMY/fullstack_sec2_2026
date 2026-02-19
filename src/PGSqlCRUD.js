// Description: Node Express REST API with Sequelize and SQLite CRUD Book
// Date: 03/29/2020
// npm install express sequelize sqlite3
// Run this file with node SequlizeSQLiteCRUDBook.js
// Test with Postman
require("dotenv").config();

const express = require('express');
const Sequelize = require('sequelize');
const app = express();
// parse incoming requests
app.use(express.json());

// set db url
const dbUrl = 'postgres://webadmin:EADaco15146@node84925-earthenv.th.app.ruk-com.cloud:11806/Books'

// create a connection to the database
const sequelize = new Sequelize(dbUrl);


const Book = sequelize.define('book', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// create the books table if it doesn't exist
sequelize.sync();

app.get("/", (req, res) => {
  res.send("Hello book World!");
});


// route to get all books
app.get('/books', (req, res) => {
  Book.findAll().then(books => {
    res.json(books);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to get a book by id
app.get('/books/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to create a new book
app.post('/books', (req, res) => {
  Book.create(req.body).then(book => {
    res.send(book);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to update a book
app.put('/books/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (book) {
      book.update(req.body).then(() => {
        res.send(book);
      }).catch(err => {
        res.status(500).send(err);
      });
    } else {
      res.status(404).send('Book not found');
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to delete a book
app.delete('/books/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (book) {
      book.destroy().then(() => {
        res.send('Deleted!');
      }).catch(err => {
        res.status(500).send(err);
      });
    } else {
      res.status(404).send('Book not found');
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

// start the server
const port = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database synced");
    app.listen(port, () =>
      console.log(`Listening on http://localhost:${port}`)
    );
  })
  .catch(err => {
    console.error("Database connection failed:", err);
  });

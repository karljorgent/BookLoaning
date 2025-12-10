const express = require('express');
const cors = require('cors');

const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const loansRouter = require('./routes/loans');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);
app.use('/api/loans', loansRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

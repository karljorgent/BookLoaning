const express = require('express');
const { prisma } = require('../prisma/client');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, description } = req.body;

    const book = await prisma.book.create({
      data: { title, author, isbn, description },
    });

    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, author, isbn, description, status } = req.body;

    const book = await prisma.book.update({
      where: { id },
      data: { title, author, isbn, description, status },
    });

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.book.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;
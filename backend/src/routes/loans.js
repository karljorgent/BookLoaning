const express = require('express');
const { prisma } = require('../prisma/client');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        user: true,
        book: true,
      },
    });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, bookId, dueDate } = req.body;

    await prisma.book.update({
      where: { id: bookId },
      data: { status: "loaned" }
    });

    const loan = await prisma.loan.create({
      data: {
        userId,
        bookId,
        dueDate: new Date(dueDate)
      }
    });

    res.status(201).json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create loan' });
  }
});

router.put('/:id/return', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const loan = await prisma.loan.update({
      where: { id },
      data: {
        returnDate: new Date(),
        status: "returned"
      }
    });

    await prisma.book.update({
      where: { id: loan.bookId },
      data: { status: "available" }
    });

    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to return loan' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.loan.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete loan' });
  }
});

module.exports = router;

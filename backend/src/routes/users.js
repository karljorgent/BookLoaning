const express = require('express');
const { prisma } = require('../prisma/client');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await prisma.user.create({
      data: { name, email, role }
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, role } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;

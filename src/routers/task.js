const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((key) => validUpdates.includes(key));

  if (isValidOperation) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      updates.forEach((element) => {
        task[element] = req.body[element];
      });
      const response = await task.save();
      if (!response) {
        res.status(404).send();
      }
      res.send(response);
    } catch (_) {
      res.status(500).send();
    }
  } else {
    res.status(400).send({ error: 'Invalid updates!' });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Task.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;

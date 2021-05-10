const express = require('express');
const Vacancy = require('../models/vacancy');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/vacancies', async (req, res) => {
  try {
    const vacancy = new Vacancy(req.body);
    await vacancy.save();
    res.status(201).send(vacancy);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/vacancies', async (req, res) => {
  try {
    const vacancies = await Vacancy.find({});
    res.send(vacancies);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/vacancies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vacancy = await Vacancy.findById(id);
    if (!vacancy) {
      res.status(404).send();
    }
    res.send(vacancy);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/vacancies/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((key) => validUpdates.includes(key));

  if (isValidOperation) {
    try {
      const { id } = req.params;
      const vacancy = await Vacancy.findById(id);
      updates.forEach((element) => {
        vacancy[element] = req.body[element];
      });
      const response = await vacancy.save();
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

router.delete('/vacancies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Vacancy.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;

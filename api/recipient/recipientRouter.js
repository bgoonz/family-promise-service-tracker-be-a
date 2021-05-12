const express = require('express');
const DB = require('../utils/db-helper');
// const Recipients = require('./recipientModel');
const router = express.Router();
const { requireAdmin } = require('../middleware/authorization');

// GET - View all recipients
router.get('/', (req, res) => {

  DB.findAll('recipients')
    .then((recipients) => {
      res.status(200).json(recipients);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// GET - View recipient by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    DB.findById('recipients', id)
       .then((recipient) => {
          if (recipient) {
            res.status(200).json(recipient);
          } else {
            res.status(404).json({ error: `Recipient ${id} not found` });
          }
       })
       .catch((err) => {
          res.status(500).json({ error: err.message });
       });
});

// POST - Create new recipient
router.post('/', (req, res) => {
  DB.create('recipients', req.body)
    .then((newRecipient) => {
      res.status(201).json({ message: 'Recipient created', newRecipient });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// PUT - Update recipient by ID
router.put('/:id', (req, res) => {
  DB.update('recipients', req.params.id, req.body)
    .then((editedRecipient) => {
      res.status(200).json({
        message: `Recipient ${req.params.id} updated`,
        editedRecipient,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// DELETE - Remove recipient by ID
router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;

  DB.remove('recipients', id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: `Recipient ${id} has been removed` });
      } else {
        res.status(404).json({ message: `Recipient ${id} could not be found` });
      }
     })
     .catch((err) => {
        res.status(500).json({ error: err.message });
     });
});

module.exports = router;
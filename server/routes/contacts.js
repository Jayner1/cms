const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');
const mongoose = require('mongoose');

// GET all contacts with populated groups
router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
        message: 'Contacts fetched successfully',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// POST create a new contact
router.post('/', (req, res, next) => {
  const maxContactId = sequenceGenerator.nextId("contacts");

  // Make sure group is an array of ObjectIds or empty array
  let groupIds = [];
  if (Array.isArray(req.body.group)) {
    groupIds = req.body.group.map(id => mongoose.Types.ObjectId(id));
  }

  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: groupIds
  });

  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// PUT update existing contact
router.put('/:id', (req, res, next) => {
  // Prepare updated fields
  let groupIds = [];
  if (Array.isArray(req.body.group)) {
    groupIds = req.body.group.map(id => mongoose.Types.ObjectId(id));
  }

  Contact.updateOne({ id: req.params.id }, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: groupIds
  })
    .then(result => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Contact not found.' });
      }
      res.status(200).json({ message: 'Contact updated successfully' });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// DELETE remove a contact
router.delete('/:id', (req, res, next) => {
  Contact.deleteOne({ id: req.params.id })
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Contact not found.' });
      }
      res.status(200).json({ message: 'Contact deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;

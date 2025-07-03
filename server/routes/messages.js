const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const mongoose = require('mongoose');

// GET all messages with populated sender info
router.get('/', (req, res, next) => {
  Message.find()
    .populate('sender')
    .then(messages => {
      res.status(200).json({
        message: 'Messages fetched successfully',
        messages: messages
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// POST create a new message
router.post('/', (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId("messages");

  let senderId = null;
  if (req.body.sender) {
    senderId = mongoose.Types.ObjectId(req.body.sender);
  }

  const message = new Message({
    id: maxMessageId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: senderId
  });

  message.save()
    .then(createdMessage => {
      res.status(201).json({
        message: 'Message added successfully',
        messageObj: createdMessage
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// PUT update existing message
router.put('/:id', (req, res, next) => {
  let senderId = null;
  if (req.body.sender) {
    senderId = mongoose.Types.ObjectId(req.body.sender);
  }

  Message.updateOne({ id: req.params.id }, {
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: senderId
  })
    .then(result => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Message not found.' });
      }
      res.status(200).json({ message: 'Message updated successfully' });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// DELETE remove a message
router.delete('/:id', (req, res, next) => {
  Message.deleteOne({ id: req.params.id })
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Message not found.' });
      }
      res.status(200).json({ message: 'Message deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;

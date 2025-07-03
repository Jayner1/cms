const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');
const mongoose = require('mongoose');

// GET all documents
router.get('/', (req, res, next) => {
  Document.find()
    .then(documents => {
      res.status(200).json({
        message: 'Documents fetched successfully',
        documents: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// POST create a new document
router.post('/', (req, res, next) => {
  const maxDocumentId = sequenceGenerator.nextId("documents");

  const document = new Document({
    id: maxDocumentId,
    name: req.body.name,
    url: req.body.url,
    children: req.body.children || []
  });

  document.save()
    .then(createdDocument => {
      res.status(201).json({
        message: 'Document added successfully',
        document: createdDocument
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// PUT update existing document
router.put('/:id', (req, res, next) => {
  Document.updateOne({ id: req.params.id }, {
    name: req.body.name,
    url: req.body.url,
    children: req.body.children || []
  })
    .then(result => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Document not found.' });
      }
      res.status(200).json({ message: 'Document updated successfully' });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// DELETE remove a document
router.delete('/:id', (req, res, next) => {
  Document.deleteOne({ id: req.params.id })
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Document not found.' });
      }
      res.status(200).json({ message: 'Document deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;

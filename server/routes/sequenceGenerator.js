const Sequence = require('../models/sequence');

let maxDocumentId;
let maxMessageId;
let maxContactId;
let sequenceId = null;

function SequenceGenerator() {
  // Immediately invoke async function to load sequence data
  (async () => {
    try {
      const sequence = await Sequence.findOne().exec();
      if (!sequence) {
        throw new Error('No sequence document found');
      }
      sequenceId = sequence._id;
      maxDocumentId = sequence.maxDocumentId;
      maxMessageId = sequence.maxMessageId;
      maxContactId = sequence.maxContactId;
    } catch (err) {
      console.error('SequenceGenerator initialization error:', err);
    }
  })();
}

SequenceGenerator.prototype.nextId = function(collectionType) {
  let updateObject = {};
  let nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = { maxDocumentId: maxDocumentId };
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = { maxMessageId: maxMessageId };
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = { maxContactId: maxContactId };
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  // Update the sequence document asynchronously but don't await here
  Sequence.updateOne({ _id: sequenceId }, { $set: updateObject }).exec()
    .catch(err => console.error('nextId update error:', err));

  return nextId;
};

module.exports = SequenceGenerator;

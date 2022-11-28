const mongoose = require('mongoose');
const _ = require('underscore');

let MessageModel = {};

const setMessage = (messageText) => _.escape(messageText).trim();

const MessageSchema = new mongoose.Schema({
  messageText: {
    type: String,
    required: true,
    trim: true,
    set: setMessage,
  },

  postedBy: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  channel: {
    type: String,
    required: true,
    trim: true,
    default: 'general',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.statics.toAPI = (doc) => ({
  messageText: doc.message,
});

MessageSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return MessageModel.find(search).select('name age').lean().exec(callback);
};

MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;

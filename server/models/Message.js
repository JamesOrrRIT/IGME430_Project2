const mongoose = require('mongoose');
const _ = require('underscore');

let MessageModel = {};

const setName = (name) => _.escape(name).trim();

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.statics.toAPI = (doc) => ({
  name: doc.name,
});

MessageSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return MessageModel.find(search).select('name age').lean().exec(callback);
};

MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;

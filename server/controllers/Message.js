const models = require('../models');
const MessageModel = require('../models/Message');

const { Message } = models;

const makerPage = (req, res) => res.render('app');

const makeMessage = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const messageData = {
    name: req.body.name,
    owner: req.session.account._id,
  };

  try {
    const newMessage = new Message(messageData);
    await newMessage.save();
    return res.status(201).json({ name: newMessage.name });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getMessages = (req, res) => MessageModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ domos: docs });
});

module.exports = {
  makerPage,
  makeMessage,
  getMessages,
};

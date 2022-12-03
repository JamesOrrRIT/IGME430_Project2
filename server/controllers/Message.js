const models = require('../models');
const MessageModel = require('../models/Message');

const { Message } = models;

const appPage = (req, res) => res.render('app');

const makeMessage = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const messageData = {
    messageText: req.body.messageText,
    postedBy: req.session.account._id,
  };

  try {
    const newMessage = new Message(messageData);
    await newMessage.save();
    return res.status(201).json({ name: newMessage.messageText });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Message already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

// Change this to make get request to the server with a query parameter for the channel name
// MessageModel.find({channel: 'general'})
const getMessages = async (req, res) => {
  try {
    const docs = await MessageModel.find({ channel: req.query.channel }).lean().exec();
    return res.json({ messages: docs });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }
};

module.exports = {
  appPage,
  makeMessage,
  getMessages,
};

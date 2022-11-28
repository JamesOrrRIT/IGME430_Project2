const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match! ' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(400).json({ error: 'An error occurred.' });
  }
};

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

const profile = (req, res) => {
  res.render('profile', { csrfToken: req.csrfToken() });
};

const returnUsername = (req) => `${req.body.username}`;

const profileDetails = async (req, res) => {
  const nickname = `${req.body.nickname}`;
  const bio = `${req.body.bio}`;
  const colorPicker = `${req.body.colorPicker}`;

  if (!nickname || !bio) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  let doc;
  try {
    doc = await Account.findByIdAndUpdate(req.session.account._id, {
      nickname,
      bio,
      colorPicker,
    }, { new: true }).exec();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred.' });
  }

  if (!doc) {
    return res.status(500).json({ error: 'Something went wrong updating profile' });
  }

  req.session.account = Account.toAPI(doc);
  return res.json({ message: 'Account settings updated properly' });
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
  profile,
  returnUsername,
  profileDetails,
};

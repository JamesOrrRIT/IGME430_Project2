const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getMessages', mid.requiresLogin, controllers.Message.getMessages);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/app', mid.requiresLogin, controllers.Message.appPage);
  app.post('/app', mid.requiresLogin, controllers.Message.makeMessage);

  app.get('/profile', mid.requiresSecure, mid.requiresLogin, controllers.Account.profile);
  app.post('/profile', mid.requiresSecure, mid.requiresLogin, controllers.Account.profileDetails);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

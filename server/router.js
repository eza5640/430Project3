const controllers = require('./controllers');
const mid = require('./middleware');
const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getTens', mid.requiresLogin, controllers.Tens.getTens);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Tens.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Tens.make);
  app.get('/premium', mid.requiresLogin, mid.requiresSecure, controllers.Account.premium);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

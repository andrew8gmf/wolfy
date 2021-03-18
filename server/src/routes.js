const { Router } = require('express');

const userController = require('./controllers/userController');

const authMiddleware = require('./middlewares/auth');

const routes = Router();

routes.get('/users', userController.list);

routes.post('/register', userController.register);
routes.get('/verify-email', userController.verify);

routes.post('/login', userController.login);
routes.get('/home', authMiddleware, userController.home);

routes.post('/forgot_password', userController.forgot);
routes.post('/reset_password/:token', userController.reset);

module.exports = routes;
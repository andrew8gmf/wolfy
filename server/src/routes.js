const { Router } = require('express');

const userController = require('./controllers/userController');
const friendsController = require('./controllers/friendsController');

const authMiddleware = require('./middlewares/auth');

const routes = Router();

routes.get('/users', userController.list);

routes.post('/register', userController.register);
routes.get('/verify_email', userController.verify);

routes.post('/login', userController.login);
routes.get('/home', authMiddleware, userController.home);

routes.post('/forgot_password', userController.forgot);
routes.post('/reset_password/:token', userController.reset);

routes.post('/friends/add', friendsController.add);
routes.post('/friends/accept', friendsController.accept);
routes.post('/friends/remove', friendsController.remove);

module.exports = routes;
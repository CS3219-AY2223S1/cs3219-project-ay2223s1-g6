import express from 'express';
const router = express.Router()

import * as authController from '../controllers/authentication-controller.js'
import * as userController from '../controllers/user-controller.js'

router.route('/login')
    .post(userController.userLogin, authController.create)
    .delete(authController.destroy)

router.route('/account')
    .post(userController.createUser, authController.create)
    .put(authController.verify, userController.changePassword)
    .delete(authController.verify, userController.deleteUser, authController.destroy)

router.route('/authentication')
    .get(authController.standalone)

export default router
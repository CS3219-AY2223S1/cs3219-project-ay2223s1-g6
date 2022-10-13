// api-routes.js
// Initialize express router
//let router = require('express').Router();
import express from 'express'
let router = express.Router()
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});

// Import contact controller
//var questionsController = require('../controllers/questionControllers.js');
//var questionsController1 = require('../controllers/question-controller');
import {
    createUser as _createUser,
    getRandomQuestionNo as _getRandomQuestionNo,
    viewQuestion as _viewQuestion,
    updateQuestion as _updateQuestion,
    deleteQuestion as _deleteQuestion
} from "../controllers/question-controller.js";
// var abc = require('../controllers/question-controller');

// create contact
// <<<<<<< HEAD
// router.route('/add').post(questionsController.new)
// router.route('/delete/:question_id?').delete(questionsController.delete)
// router.route('/update/:question_id?').put(questionsController.update)
// router.route('/read/:question_id?').get(questionsController.view)
// router.route('/readRandom/:difficultyLevel?').get(questionsController.getRandomQuestionNo)
router.route('/').post(_createUser)
router.route('/randomId/:difficultyLevel?').get(_getRandomQuestionNo)
router.route('/:question_id?').get(_viewQuestion)
router.route('/:question_id?').put(_updateQuestion)
router.route('/:question_id?').delete(_deleteQuestion)
//
// router.route('/add').post(questionsController.new)
// router.route('/delete/:question_id?').delete(questionsController.delete)
// router.route('/update/:question_id?').put(questionsController.update)
// router.route('/read/:question_id?').get(questionsController.view)
// router.route('/randomId/:difficultyLevel').get(questionsController.getRandomQuestionNo);

export default router;
//module.exports = router;

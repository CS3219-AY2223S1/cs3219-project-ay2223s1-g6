// api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});

// Import contact controller
var questionsController = require('../controllers/questionControllers');

// create contact
router.route('/add').post(questionsController.new)
router.route('/delete/:question_id?').delete(questionsController.delete)
router.route('/update/:question_id?').put(questionsController.update)
router.route('/read/:question_id?').get(questionsController.view)
router.route('/randomId/:difficultyLevel').get(questionsController.getRandomQuestionNo);


module.exports = router;

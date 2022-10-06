// questionController.js
// Import question model
Questions = require('../models/questionsModels');

// Handle create questions actions
exports.new = function (req, res) {
    var questions = new Questions();
    questions._id = req.body._id ? req.body._id : questions._id;
    questions.question_title = (req.body.question_title ? req.body.question_title : questions.name);
    questions.question_description = req.body.question_description ? req.body.question_description : questions.question_description;
    questions.question_examples = req.body.question_examples ? req.body.question_examples : questions.question_examples;
    questions.question_constrains = req.body.question_constrains ? req.body.question_constrains : questions.question_constrains;
    questions.has_solution = req.body.has_solution ? req.body.has_solution : questions.has_solution;
    questions.acceptance = req.body.acceptance ? req.body.acceptance : questions.acceptance;
    questions.difficulty = req.body.difficulty ? req.body.difficulty : questions.difficulty;
    questions.frequency = req.body.frequency ? req.body.frequency : "frequency hidden";

    // save the questions and check for errors
    questions.save(function (err, next) {
        if (err) {
            res.json("encounter error while saving: " + err);
            return next(err);
        }
        res.json({
            message: 'New questions created!',
            data: questions
        });
    });
};
// Handle view question info
exports.view = function (req, res, next) {
    Questions.findById(req.params.question_id ? req.params.question_id : req.body._id, function (err, question) {
        if (err) {
            res.json("encounter error while find the id: " + err);
            return next(err);
        }
        res.json({
            message: 'Question details loading..',
            data: question
        });
    });
};

// Handle get random question number
exports.getRandomQuestionNo = function (req, res, next) {
    var inputDifficultyLevel = req.params.difficultyLevel ? req.params.difficultyLevel : req.body.difficulty
    Questions.find({difficulty: inputDifficultyLevel}, function(err, question) {
        var sizeOfQuestion = question.length
        var randomIndex = Math.floor(Math.random() * (sizeOfQuestion))
        var questionExtracted = question[randomIndex]
        var questionIdExtracted = questionExtracted["_id"]
        if (err) {
            res.json("encounter error while find the question number: " + err);
            return next(err);
        }

        res.json({
            message: 'Question number sent',
            data: questionIdExtracted
        });
    });
};

// Handle update question info
exports.update = function (req, res, next) {
    Questions.findById(req.params.question_id ? req.params.question_id : req.body._id, function (err, question) {
        if (err) {
            res.json("encounter error while find the id: " + err);
            return next(err);
        }
        if (question == null) {
            res.json("question is null")
            return next(err)
        }
        question._id = req.body._id ? req.body._id : question._id;
        question.question_title = (req.body.question_title ? req.body.question_title : question.question_title);
        question.question_description = req.body.question_description ? req.body.question_description : question.question_description;
        question.question_examples = req.body.question_examples ? req.body.question_examples : question.question_examples;
        question.question_constrains = req.body.question_constrains ? req.body.question_constrains : question.question_constrains;
        question.has_solution = req.body.has_solution ? req.body.has_solution : question.has_solution;
        question.acceptance = req.body.acceptance ? req.body.acceptance : question.acceptance;
        question.difficulty = req.body.difficulty ? req.body.difficulty : question.difficulty;
        question.frequency = req.body.frequency ? req.body.frequency : question.frequency;

// save the question and check for errors
        question.save(function (err, next) {
            if (err) {
                res.json("encounter error while saving: " + err);
                return next(err)
            }
            res.json({
                message: 'Questions Info updated',
                data: question
            });
        });
    });
};

// Handle delete Questions
exports.delete = function (req, res, next) {
    Questions.remove({
        _id: req.params.question_id ? req.params.question_id : req.body._id
    }, function (err) {
        if (err) {
            res.json("encounter error while deleting: " + err);
            return next(err)
        }
        res.json({
            status: "success",
            message: 'question deleted'
        });
    });
};
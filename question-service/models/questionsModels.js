// questionModel.js
var mongoose = require('mongoose');
// Setup schema
var questionExampleSchema = mongoose.Schema({
    example_input: {
        type: String, required: true
    },
    example_output: {
        type: String, required: true
    },
    example_explanation: String,
})

var questionConstrainsSchema = mongoose.Schema({
    question_constrains: {
        type: String, required: true
    },
})

var questionSchema = mongoose.Schema({
    _id: {
        type: String, required: true
    },
    question_title: {
        type: String,
        required: true
    },
    question_description: {
        type: String,
        required: true
    },
    question_examples: [questionExampleSchema],
    question_constrains: [questionConstrainsSchema],
    has_solution: {
        type: String,
        required: true
    },
    acceptance: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    frequency: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});
// Export Questions model
var Questions = module.exports = mongoose.model('questions', questionSchema);
module.exports.get = function (callback, limit) {
    Questions.find(callback).limit(limit);
}

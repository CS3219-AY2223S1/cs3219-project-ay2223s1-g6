// questionModel.js
//var mongoose = require('mongoose');
import mongoose from 'mongoose'
// Setup schema
var questionExampleSchema = new mongoose.Schema({
    example_input: {
        type: String, required: true
    },
    example_output: {
        type: String, required: true
    },
    example_explanation: String,
})

var questionConstrainsSchema = new mongoose.Schema({
    question_constrains: {
        type: String, required: true
    },
})

var questionSchema = new mongoose.Schema({
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
var Questions = mongoose.model('questions', questionSchema);

export default Questions
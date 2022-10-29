import Questions from './question-model.js';

import 'dotenv/config'

//Set up mongoose connection
import mongoose from 'mongoose';
import * as Console from "console";

mongoose.connect(process.env.MONGODB_CLOUD_URI, { useNewUrlParser: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Question MongoDB connection error:'));


export async function createUser(params) {
    var questions = new Questions(params);
    questions._id = params.questionsId;
    questions.question_title = params.questionsQuestionTitle;
    questions.question_description = params.questionsQuestionDescription;
    questions.question_examples = params.questionsQuestionExamples;
    questions.question_constrains = params.questionsQuestionConstrains;
    questions.has_solution = params.questionsHasSolution;
    questions.acceptance = params.questionsAcceptance;
    questions.difficulty = params.questionsDifficulty;
    questions.frequency = params.questionsFrequency;
    return questions
}

export async function getRandomQuestionNo(params) {
    try {
        var question = await Questions.find({difficulty: params.inputDifficultyLevel});
        var sizeOfQuestion = question.length
        var randomIndex = Math.floor(Math.random() * (sizeOfQuestion))
        var questionExtracted = question[randomIndex]
        var questionIdExtracted = questionExtracted["_id"]
        return questionIdExtracted;
    } catch (err) {
        console.log('ERROR: Could not get new question');
        return { err };
    }
}

export async function getQuestionNo(params) {
    try {
        console.log("in get Q")
        var question = await Questions.findById(params.inputQuestionNo);
        return question;
    } catch (err) {
        console.log('ERROR: Could not get question number');
        return { err };
    }
}

export async function updateQuestion(params) {
    try {
        console.log("in final update before")
        var questions = await Questions.findById(params.inputQuestionNo);
        console.log("in final update after")
        questions.question_title = params.questionsQuestionTitle;
        questions.question_description = params.questionsQuestionDescription;
        questions.question_examples = params.questionsQuestionExamples;
        questions.question_constrains = params.questionsQuestionConstrains;
        questions.has_solution = params.questionsHasSolution;
        questions.acceptance = params.questionsAcceptance;
        questions.difficulty = params.questionsDifficulty;
        questions.frequency = params.questionsFrequency;
        return questions;
    } catch (err) {
        console.log('ERROR: Could not get question number');
        return { err };
    }
}

export async function deleteQuestion(params) {
    try {
        await Questions.remove({_id:params.inputQuestionNo});
        return 'question deleted';
    } catch (err) {
        console.log('ERROR: Could not delete question number');
        return { err };
    }
}
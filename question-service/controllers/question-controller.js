import { ormCreateUser as _createUser,
        ormGetRandomQuestionNo as _getRandomQuestionNo,
    ormGetQuestionNo as _getQuestionNo,
    ormUpdateQuestion as _updateQuestion,
    ormDeleteQuestion as _deleteQuestion} from '../models/question-orm.js'
// import { Questions } from '../models/question-model.js'

export async function createUser(req, res) {
    try {
        var questionsId = req.body._id ? req.body._id : "missing id";
        var questionsQuestionTitle = (req.body.question_title ? req.body.question_title : "missing name");
        var questionsQuestionDescription = req.body.question_description ? req.body.question_description : "missing description";
        var questionsQuestionExamples = req.body.question_examples ? req.body.question_examples : "missing examples";
        var questionsQuestionConstrains = req.body.question_constrains ? req.body.question_constrains : "missing constraints";
        var questionsHasSolution = req.body.has_solution ? req.body.has_solution : "missing solution";
        var questionsAcceptance = req.body.acceptance ? req.body.acceptance : "missing acceptance";
        var questionsDifficulty = req.body.difficulty ? req.body.difficulty : "missing difficulty";
        var questionsFrequency = req.body.frequency ? req.body.frequency : "frequency hidden";

        const resp = await _createUser(questionsId, questionsQuestionTitle, questionsQuestionDescription, questionsQuestionExamples,
            questionsQuestionConstrains, questionsHasSolution, questionsAcceptance,
            questionsDifficulty, questionsFrequency);
        console.log(resp);
        if (resp.err) {
            return res.status(400).json({message: 'Could not create a new question!'});
        } else {
            console.log(`Created new question ${questionsQuestionTitle} successfully!`)
            return res.status(201).json({message: `Created new questions ${questionsQuestionTitle} successfully!`});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function getRandomQuestionNo(req, res) {
    try {
        var inputDifficultyLevel = req.params.difficultyLevel ? req.params.difficultyLevel : req.body.difficulty
        const resp = await _getRandomQuestionNo(inputDifficultyLevel);
        console.log(resp);
        if (resp.err) {
            return res.status(400).json({message: 'Could not get a question based on the difficulty level!'});
        } else {
            console.log(`Get new question of difficulty ${inputDifficultyLevel} successfully!`)
            return res.status(201).json({message: `Get new questions no: ${resp} successfully!`});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when getting a question based on the difficulty level!'})
    }
}

export async function viewQuestion(req, res) {
    try {
        var questionNo = req.params.question_id ? req.params.question_id : req.body._id
        const resp = await _getQuestionNo(questionNo);
        console.log(resp);
        if (resp.err) {
            return res.status(400).json({message: 'Could not get a question number!'});
        } else {
            console.log(`Get question number ${questionNo} successfully!`)
            return res.status(201).json({message: `Get questions no: ${questionNo} successfully!`, question: `${resp}`});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when getting a question number!'})
    }
}

export async function updateQuestion(req, res) {
    try {
        var questionUpdate = req.params.question_id ? req.params.question_id : req.body._id
        var questionsQuestionTitle = (req.body.question_title ? req.body.question_title : "missing name");
        var questionsQuestionDescription = req.body.question_description ? req.body.question_description : "missing description";
        var questionsQuestionExamples = req.body.question_examples ? req.body.question_examples : "missing examples";
        var questionsQuestionConstrains = req.body.question_constrains ? req.body.question_constrains : "missing constraints";
        var questionsHasSolution = req.body.has_solution ? req.body.has_solution : "missing solution";
        var questionsAcceptance = req.body.acceptance ? req.body.acceptance : "missing acceptance";
        var questionsDifficulty = req.body.difficulty ? req.body.difficulty : "missing difficulty";
        var questionsFrequency = req.body.frequency ? req.body.frequency : "frequency hidden";
        const resp = await _updateQuestion(questionUpdate, questionsQuestionTitle, questionsQuestionDescription, questionsQuestionExamples,
            questionsQuestionConstrains, questionsHasSolution, questionsAcceptance,
            questionsDifficulty, questionsFrequency);
        console.log(resp);
        if (resp.err) {
            return res.status(400).json({message: 'Could not update question number!'});
        } else {
            console.log(`Update question number ${questionUpdate} successfully!`)
            return res.status(201).json({message: `Update questions successfully!`, question: `${resp}`});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when updating a question number!'})
    }
}

export async function deleteQuestion(req, res) {
    try {
        var questionDelete = req.params.question_id ? req.params.question_id : req.body._id
        const resp = await _deleteQuestion(questionDelete);
        console.log(resp);
        if (resp.err) {
            return res.status(400).json({message: 'Could not delete question!'});
        } else {
            console.log(`Delete question number ${questionDelete} successfully!`)
            return res.status(201).json({message: `Delete questions successfully!`});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when deleting a question number!'})
    }
}
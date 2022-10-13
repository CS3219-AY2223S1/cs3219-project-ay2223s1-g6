import { createUser, getRandomQuestionNo, getQuestionNo, updateQuestion, deleteQuestion} from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(questionsId, questionsQuestionTitle, questionsQuestionDescription, questionsQuestionExamples,
                                    questionsQuestionConstrains, questionsHasSolution, questionsAcceptance,
                                    questionsDifficulty, questionsFrequency) {
    try {
        console.log("question title" + questionsQuestionTitle);
        const newUser = await createUser({questionsId, questionsQuestionTitle,
            questionsQuestionDescription, questionsQuestionExamples,
            questionsQuestionConstrains, questionsHasSolution, questionsAcceptance,
            questionsDifficulty, questionsFrequency});
        await newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}


export async function ormGetRandomQuestionNo(inputDifficultyLevel) {
    try {
        let resp = await getRandomQuestionNo({inputDifficultyLevel});
        if (resp.err) {
            var res1 = resp.err
            return {res1};
        } else {
            return resp;
        }
    } catch (err) {
        console.log('ERROR: Could not get new question');
        return { err };
    }
}

export async function ormGetQuestionNo(inputQuestionNo) {
  try {
    console.log('in orm get');
    return await getQuestionNo({ inputQuestionNo });
  } catch (err) {
    console.log('ERROR: Could not get question number');
    return { err };
  }
}

export async function ormUpdateQuestion(inputQuestionNo, questionsQuestionTitle, questionsQuestionDescription, questionsQuestionExamples,
                                        questionsQuestionConstrains, questionsHasSolution, questionsAcceptance,
                                        questionsDifficulty, questionsFrequency) {
    try {
        let resp = await updateQuestion({inputQuestionNo, questionsQuestionTitle, questionsQuestionDescription, questionsQuestionExamples,
            questionsQuestionConstrains, questionsHasSolution, questionsAcceptance,
            questionsDifficulty, questionsFrequency});
        console.log("the res is:" + resp)
        if (resp.err) {
            var res1 = resp.err
            return {res1};
        } else {
            await resp.save();
            return resp;
        }
    } catch (err) {
        console.log('ERROR: Could not get question number');
        return { err };
    }
}

export async function ormDeleteQuestion(inputQuestionNo) {
    try {
        let resp = await deleteQuestion({inputQuestionNo});
        console.log("the res is:" + resp)
        if (resp.err) {
            var res1 = resp.err
            return {res1};
        } else {
            return resp;
        }
    } catch (err) {
        console.log('ERROR: Could not get question number');
        return { err };
    }
}
import PendingMatch from './match-model.js';

export async function createPendingMatch(params) {
  if (params.difficultyLevel.toString() == "easy") {
    return PendingMatch.easyLevel.create(params);
  } else if (params.difficultyLevel.toString() == "medium") {
    return PendingMatch.mediumLevel.create(params);
  } else if (params.difficultyLevel.toString() == "hard") {
    return PendingMatch.hardLevel.create(params);
  }
  // return PendingMatch.create(params);
}

export async function deletePendingMatch(id, difficultyLevel) {
  if (difficultyLevel == "easy") {
    return PendingMatch.easyLevel.destroy({where: {userId: id}});
  } else if (difficultyLevel == "medium") {
    return PendingMatch.mediumLevel.destroy({where: {userId: id}});
  } else if (difficultyLevel == "hard") {
    return PendingMatch.hardLevel.destroy({where: {userId: id}});
  }
  // return PendingMatch.create(params);
}

export async function findPendingMatch(params) {
  var result = "";
  if (params.difficultyLevel.toString() == "easy") {
    result = await PendingMatch.easyLevel.findOne({where: {difficultyLevel: "easy"}});
  } else if (params.difficultyLevel.toString() == "medium") {
    result = await PendingMatch.mediumLevel.findOne({where: {difficultyLevel: "medium"}});
  } else if (params.difficultyLevel.toString() == "hard") {
    result = await PendingMatch.hardLevel.findOne({where: {difficultyLevel: "hard"}});
  }


  if (result == null) {
    console.log("no match at current moment, waiting for incoming match");
    await createPendingMatch(params);
    var waitTill = new Date(new Date().getTime() + 3 * 1000);
    var noMatched = true;
    while(waitTill > new Date()){
      console.log("i am waiting")
    }

    if (noMatched) {
      return "no match at current moment, waiting for incoming match";
    } else {
      await deletePendingMatch(params.userId, params.difficultyLevel);
      return "found match";
    }
  } else {
    await deletePendingMatch(result.userId, result.difficultyLevel)
    return "found match";
  }

}

// export default {findMatch};

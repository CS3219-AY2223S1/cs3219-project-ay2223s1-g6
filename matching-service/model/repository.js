import PendingMatch from './match-model.js';
import io from '../index.js'

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
    var waitTill = new Date(new Date().getTime() + 10 * 1000);
    var noMatched = true;
    while(waitTill > new Date()) {
      io.on("getMatched", (arg, callback) => {
        console.log(arg);
        if (arg == params.difficultyLevel.toString()) {
          noMatched = false;
          callback("matched successfully");
        }
      });
      console.log("i am waiting")
    }
    await deletePendingMatch(params.userId, params.difficultyLevel);
    if (noMatched) {
      return "no match at current moment, waiting for incoming match";
    } else {
      return "found match";
    }
  } else {
    io.emit("getMatched", params.difficultyLevel.toString() , (response) => {
      console.log(response);
    });
    await deletePendingMatch(result.userId, result.difficultyLevel)
    return "found match";
  }
}

// export default {findMatch};

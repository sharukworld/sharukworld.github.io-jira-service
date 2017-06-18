exports.getAllIssuesHelper = function (data) {
  let allIssue = JSON.parse(data).issues;
  let lessThan21Logs = [];
  let moreThan20Logs = [];
  allIssue.forEach(el => {
    if (el.fields.worklog.total > 20) {
      moreThan20Logs.push(el);
    }
    else {
      lessThan21Logs.push(el);
    }
  });
  return {
    'moreThan20Logs':moreThan20Logs,
    'lessThan21Logs':lessThan21Logs
  };
}

exports.mapUserAndIssue = function (data) {
  let userList = [];
  data.forEach(element => {
    element.fields.worklog.worklogs.forEach(el => {
      let firstDate = global.data.startDateCompare;
      let endDate = global.data.endDateCompare;
      let firstDateCompare = new Date(firstDate);
      let endDateCompare = new Date(endDate);
      let currentDate = new Date(el.created);
      console.log(currentDate,' ',firstDateCompare,' ',endDateCompare,'' , (currentDate >= firstDateCompare && currentDate<endDateCompare))
      if((currentDate >= firstDateCompare && currentDate<endDateCompare)){
      let user = userList.find(x => (x.accountId == el.author.accountId))
      if (user != null) {
        if (user.worklogs == null)
          user['worklogs'] = [];
        
         el['key'] = element.key;
        user.timeSpentSeconds+=el.timeSpentSeconds;
        user.worklogs.push(el);
      }
      else {
        el.author['worklogs'] = [];
        el['key'] = element.key;
        el.author.worklogs.push(el);
        el.author['timeSpentSeconds'] = el.timeSpentSeconds;
        userList.push(el.author);
      }
    }
  });
  });
  return userList;
}

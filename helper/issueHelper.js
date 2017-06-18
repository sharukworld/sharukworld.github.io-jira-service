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
      let firstDate = global.data.fromDate;
      let endDate = global.data.toDate;
      let firstDateCompare = new Date(firstDate + ' 00:00:00');
      let endDateCompare = new Date(endDate + ' 00:00:00');
      let currentDate = new Date(el.created);
      //console.log('el',el.created, 'satisfy', (currentDate >= firstDateCompare && currentDate<endDateCompare));
      if((currentDate >= firstDateCompare && currentDate<endDateCompare)){
      let user = userList.find(x => (x.accountId == el.author.accountId))
      if (user != null) {
        if (user.worklogs == null)
          user['worklogs'] = [];
        
         el['key'] = element.key;
         console.log('before',user.timeSpentSeconds);
         user.timeSpentSeconds+=el.timeSpentSeconds;
           console.log('after',user.timeSpentSeconds);
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

let https = require('https');
let issueHelper = require('../helper/issueHelper')

exports.getAllIssue = function (data, callBack) {
    let options = {
        host: data.jiraDomain,
        path: '/rest/api/2/search?maxResults=2000&fields=key,summary,worklog&jql=project=' + data.project + '%20and%20updated>' + data.fromDate,
        headers: {
            'Authorization': 'Basic ' + data.encryptedData,
            'Content-Type': 'application/json'
        }
    };
    let str = '';
    https.request(options, function (httpResponse) {
        //another chunk of data has been recieved, so append it to `str`
        httpResponse.on('data', function (chunk) {
            str += chunk;
        });
        //the whole response has been recieved, so we just print it out here
        httpResponse.on('end', function () {
            //response.send(str);
            //console.log('inside end', str);
            let users = issueHelper.getAllIssuesHelper(str);
            callBack({'users':users});
        });
    }).end();
}
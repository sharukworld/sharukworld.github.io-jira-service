let https = require('https');
let issueHelper = require('../helper/issueHelper');
var Promise = require('promise');
let option = {};
exports.getAllIssue = function (data, callBack) {
    options = {
        host: data.jiraDomain,
        path: '/rest/api/2/search?maxResults=2000&fields=key,summary,worklog&jql=project=' + data.project + '%20and%20updated>' + data.fromDate,
        headers: {
            'Authorization': 'Basic ' + data.encryptedData,
            'Content-Type': 'application/json'
        }
    };
    let str = '';
    let $this = this;
 
    if(data.toDate !== ''){
        options.path+='%20and%20updated<'+data.toDate;
    }
    if(!options.host.endsWith('.atlassian.net')){
         callBack({ 'users': [], isValid :false, errorHeader:'Incorrect jira domain' ,errorMessage: 'Check if your jira domain is valid'});
         return;
    }
    https.request(options, function (httpResponse) {
        //another chunk of data has been recieved, so append it to `str`
        if(httpResponse.statusCode === 401 || httpResponse.statusCode === 400 || httpResponse.statusCode === 502)
        {
            let errorHeader = '';
            let errorMessage = ''
                switch(httpResponse.statusCode) {
                case 401:
                    errorHeader = 'Login failed';
                    errorMessage = 'Invalid username or password.';
                    break;
                case 400:
                    errorHeader = 'Incorrect project';
                    errorMessage = 'Please check your project name.';
                    break;
                case 502:
                    errorHeader = 'Incorrect jira domain';
                    errorMessage = 'Ensure it is without http:// and has no trailing /';
                    break;
            }
            callBack({ 'users': [], isValid :false, errorHeader:errorHeader , errorMessage:errorMessage});
            return;
        }
        httpResponse.on('data', function (chunk) {
            str += chunk;
        });

        httpResponse.on('end', function () {
            
            let currentThis = this;
            let allIssue = issueHelper.getAllIssuesHelper(str);
            let moreThan20log = allIssue.moreThan20Logs;

            for (let i = 0; i < moreThan20log.length; i++) {
                $this.getIssueIndetail(
                    moreThan20log[i].key
                ).then(
                    res => {
                        moreThan20log[i].fields.worklog = JSON.parse(res);
                        if (i === moreThan20log.length - 1) {
                            let combinedIssues = [];
                            combinedIssues = moreThan20log.concat(allIssue.lessThan21Logs);
                            let users = issueHelper.mapUserAndIssue(combinedIssues);
                            callBack({ 'users': users, isValid :true });
                        }
                    }
                    );
            }
            if (moreThan20log.length === 0) {
                let users = issueHelper.mapUserAndIssue(allIssue.lessThan21Logs);
                callBack({ 'users': users, isValid :true , isBadRequest:false});
            }
        });
    }).end();
}

exports.getIssueIndetail = function (key) {
    options.path = '/rest/api/2/issue/' + key + '/worklog';
    let str = '';
    return new Promise(function (resolve, reject) {
        https.request(options, function (httpResponse) {
            //another chunk of data has been recieved, so append it to `str`
            httpResponse.on('data', function (chunk) {
                str += chunk;
            });
            //the whole response has been recieved, so we just print it out here
            httpResponse.on('end', function () {
                //callback(str);
                resolve(str);
            });
        }).end();
    });

}
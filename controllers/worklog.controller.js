let https = require('https');
var bodyParser = require('body-parser');
var issue = require('../model/issueList');
const CircularJSON = require('circular-json');

var options = {
    host: 'toothcloud.atlassian.net',
    path: '/rest/api/2/search?maxResults=2&fields=key,summary,worklog&jql=project=TCP2',
    headers: {
        'Authorization': 'Basic c2hhcnVrLmFobWVkOnNhbTJzaG9lcw==',
        'Content-Type': 'application/json'
    }
};
module.exports = function (app) {
    app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json 
   app.use(bodyParser.json())

    app.all('/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST", "PUT");
        next();
    });

    app.get('/', function (request, response) {
        options.headers.Authorization = request.get('Authorization');
        options.host = request.get('host');
        let project = request.get('project');
        let fromDate = request.get('fromDate');
        let toDate = request.get('toDate');
        https.request(options, function (httpResponse) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            httpResponse.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            httpResponse.on('end', function () {
                response.send(str);
            });
        }).end();
    });
    app.post('/worklogs', function (request, response)  {
        let users = [];
        global.data = request.body;
     issue.getAllIssue(request.body, function(userList){
       response.send(CircularJSON.stringify(userList));
     });
    })
};
let https = require('https');
var options = {
  host: 'toothcloud.atlassian.net',
  path: '/rest/api/2/search?maxResults=2&fields=key,summary,worklog&jql=project=TCP2',
  headers: {'Authorization': 'Basic c2hhcnVrLmFobWVkOnNhbTJzaG9lcw==',
'Content-Type':'application/json'}
};
module.exports = function(app) {
 app.get('/', function(request, response) {
https.request(options, function(httpResponse) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  httpResponse.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  httpResponse.on('end', function () {
    console.log(str);
    response.send(str);
  });
}).end();
 //response.render('index.html', { pageCountMessage : null});
  });
};
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
  }).listen(5000);

}

cluster.on('fork', function(worker) {
	console.log('worker ' + worker.process.pid + ' forked');
});

cluster.on('exit', function(worker) {
	console.log('worker ' + worker.process.pid + ' died');
	cluster.fork();
});

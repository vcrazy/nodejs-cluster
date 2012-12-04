var cluster = require('cluster'),
	http = require('http'),
	numCPUs = require('os').cpus().length,
	port = 5000;

if(cluster.isMaster){
	// Fork all workers
	for(var i = 0; i < numCPUs; i++){
		cluster.fork();
	}
}else{
	// For each worker create http server
	http.createServer(function(req, res) {
		res.writeHead(200);
		res.end("hello world\n");
	}).listen(port);
}

cluster.on('fork', function(worker) {
	console.log('worker ' + worker.process.pid + ' forked');
});

cluster.on('exit', function(worker) {
	console.log('worker ' + worker.process.pid + ' died');
	cluster.fork(); // failover -> recovery
});

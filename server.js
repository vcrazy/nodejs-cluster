var cluster = require('cluster'),
	http = require('http'),
	numCPUs = require('os').cpus().length,
	sio = require('socket.io'),
	RedisStore = sio.RedisStore;

if(cluster.isMaster){
	// Fork all workers
	for(var i = 0; i < numCPUs; i++){
		cluster.fork();
	}
}else{
	var io = sio.listen(4444);

	// Pass this information to the workers
	io.set('store', new RedisStore);
	io.set('workerId', cluster.worker.process.pid);

	// Aaand.. listen
	io.sockets.on('connection', function(socket){
		console.log('from worker ' + io.get('workerId'));
		socket.broadcast.emit('connection');
	});
}

cluster.on('fork', function(worker) {
	console.log('worker ' + worker.process.pid + ' forked');
});

cluster.on('exit', function(worker) {
	console.log('worker ' + worker.process.pid + ' died');
	cluster.fork(); // failover
});

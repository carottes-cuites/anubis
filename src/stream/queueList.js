module.exports = class QueueList {
	
	var _queue;
	var _currentTrackIndex = 0;

	function QueueList() {
		_queue = new Array();
	}

	function getCurrentTrack() {
		return _queue[_currentTrackIndex];
	}

	function getQueue() {
		return _queue;
	}

	function clearQueue() {
		if(_queue.length > 0) {
			while(_queue.length > 0) {
    			_queue.pop();
			}
		} else {
			console.log("Queue is already empty.");
		}
	}

	function addToQueue(args) {
		if (Array.isArray(args)) {
			args.forEach(function(arg) {
				_queue.push(arg));
			});
		}
	}

	function currentTrackEnded() {
		_queue[0] = Object.assign(_queue[1]);
		_queue.pop();
	}
}
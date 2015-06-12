(function (routing) {
	
	var routeNode = function () {
		this.edges = [];
		this.match = function () {};
		this.action = function () {};
	};

	routeNode.prototype.findNextMatch = function (segments) {
		
	};

	routeNode.prototype.traverse = function (segments) {
		
	};

	var traverseResult = function (_parameters, _handler) {
		this.parameters = _parameters;
		this.handler = _handler;
	};

	traverseResult.prototype.extend = function (other) {
		
	};
	
	

}(window.routing = window.routing || {}));
(function(routing) {

	var routeNode = function () {
		this.edges = [];
		this.action = function (value) {};
		this.match = function (segments) {};
	}

	var traverseResult = function (_parameters, _handler) {
		this.parameters = _parameters;
		this.handler = _handler;
	}

	traverseResult.prototype.extend = function (other) {
		return new traverseResult(
			extend({}, this.parameters, other.parameters), 
			other.handler || this.handler)
	}

	traverseResult.prototype.invokeHandler = function() {
		if (this.handler) this.handler(this.parameters);
	}

	var findNextMatch = function (edges, segments) {
		return segments.length == 0 ? null : first(edges, function(edge) {
			return edge.match(segments[0]);
		});
	}

	routeNode.prototype.traverse = function (segments) {
		var result = new traverseResult(this.action(segments.shift()), this.handler);
		var next = findNextMatch(this.edges, segments);

		return next ? result.extend(next.traverse(segments)) : result;
	}

	routeNode.prototype.slash = function (next) {
		this.edges.push(next);
		return next;
	}

	var constant = function (template) {
		return compose(new routeNode(), function(node) {
			node.match = function (segment) {
				return segment == template;
			}
		});
	};

	var alpha = function (name) {
		return compose(new routeNode(), function(node) {
			node.match = function (segment) {
				return /^[a-zA-Z0-9-_]+$/.test(segment);
			}
			node.action = function (value) {
				return compose({}, function (_) { 
					_[name] = value 
				});
			}
		});
	}

	var define = function(fn) {		
		var expression = operatorOverload(
			[routeNode, function(o, node) { o.slash(node) }]);
		
		return expression.evaluate(fn(baseNode));
	}

	var execute = function(url) {
		baseNode.traverse(url.split("/")).invokeHandler();
	}

	var baseNode = constant("#")

	routing.alpha = alpha;
	routing.constant = constant;
	routing.define = define;
	routing.execute = execute;

}(window.routing = window.routing || {}))
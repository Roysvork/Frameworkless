(function (routing) {
	
	var routeNode = function () {
		this.edges = [];
		this.match = function () {};
		this.action = function () {};
	};

	routeNode.prototype.findNextMatch = function (segments) {
		return segments.length === 0 ? null : first(this.edges, function (edge) {
			return edge.match(segments[0]);
		});
	};

	routeNode.prototype.traverse = function (segments) {
		var result = new traverseResult(
			this.action(segments.shift()),
			this.handler);

		var next = this.findNextMatch(segments);
		return next ? result.extend(next.traverse(segments)) : result;
	};

	var traverseResult = function (parameters, handler) {
		this.parameters = parameters;
		this.handler = handler;
	};

	traverseResult.prototype.extend = function (other) {
		return new traverseResult(
			extend({}, this.parameters, other.parameters),
			other.handler || this.handler);
	};

	var constant = function (template) {
		return compose(new routeNode(), function (node) {
			node.match = function (segment) {
				return segment === template; 
			};
		});
	};

	var alpha = function (name) {
		return compose(new routeNode(), function (node) {
			node.match = function (segment) {
				return /^[A-Za-z0-9]+$/.test(segment);
			};
			node.action = function (segment) {
				return compose({}, function (_) { _[name] = segment; });
			};
		});
	};

	var baseNode = constant("#");

	var execute = function (url) {
		var result = baseNode.traverse(url.split("/"));
		if (result.handler) result.handler(result.parameters);
	};

	var define = function (fn) {
		var expression = operatorOverload([routeNode, function (left, right) {
			return compose(right, function() { left.edges.push(right); });
		}]);
	
		return expression.evaluate(fn(baseNode));
	};

	routing.constant = constant;
	routing.alpha = alpha;
	routing.execute = execute;
	routing.define = define;

}(window.routing = window.routing || {}));
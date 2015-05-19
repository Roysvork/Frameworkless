(function(routing, hashChange) {

	var routeNode = function () {
		this.edges = [];
		this.action = function (value) {};
		this.match = function (segments) {};
	}

	var findNextMatch = function (edges, segments) {
		return segments.length == 0 ? null : first(edges, function(edge) {
			return edge.match(segments[0]);
		});
	};

	routeNode.prototype.traverse = function (segments) {
		var parameters = this.action(segments.shift());
		var next = findNextMatch(this.edges, segments);
		return next ? extend({}, parameters, next.traverse(segments)) : parameters;
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
				return compose({}, function (_) { _[name] = value });
			}
		});
	}

	var handler = function (fn) {
		this.fn = fn;
	}

	var define = function(fn) {		
		var expression = operatorOverload(
        	[routeNode, function(o, node) { o.slash(node) }],
        	[handler, function(o, wrapper) { o.handler = wrapper.fn }]);
		
		return expression.evaluate(fn(baseNode));
	}

	var execute = function(url) {
		return baseNode.traverse(url.split("/"));
	}

	var baseNode = constant("#")

	routing.alpha = alpha;
	routing.constant = constant;
	routing.define = define;
	routing.execute = execute;

}(window.routing = window.routing || {}, window.hashchange))
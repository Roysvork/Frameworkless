(function(routing) {

	window.addEventListener('hashchange', function(e) {
		hashChanged();
	});

	document.addEventListener('click', function (e) {
		var target = e.target;
		if (target.localName === "a" && target.href === window.location.href) {
			setHash(target.hash)
		}
	})

	var setHash = function (hash) {
		history.pushState(null, window.title, hash)
		hashChanged();
	}

	var getHash = function () {
		return window.location.hash;
	}

	var hashChanged = function() {
		alert(getHash());
	}

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
		var context = {};
		routeNode.prototype.valueOf = function () {
            context.leftOperand = compose(this, function (node) { 
            	if (context.leftOperand) context.leftOperand.slash(node);
            });
        };

        handler.prototype.valueOf = function () {
        	context.leftOperand = compose(this, function (wrapper) { 
            	if (context.leftOperand) context.leftOperand.handler = wrapper.fn;
            });
        }

		fn(baseNode);
		return context.leftOperand;
	}

	var execute = function(url) {
		return baseNode.traverse(url.split("/"));
	}

	var baseNode = constant("#")
	routing.setHash = setHash;
	routing.getHash = getHash;

	routing.alpha = alpha;
	routing.constant = constant;
	routing.define = define;
	routing.execute = execute;

}(window.routing = window.routing || {}))
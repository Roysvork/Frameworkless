(function (dependency) {

	var services = {};

	var registerInstance = function (identifier, service) {
		services[identifier] = service;
	}

	var inject = function (identifiers, fn) {
		var invoker = function() {
			var args = map(arguments, function(arg) { return arg; });
			var dependencies = map(identifiers, function(identifier) {
				return services[identifier]
			});
			
			return fn.apply(this, dependencies.concat(args))
		}

		return invoker;
	}

	dependency.registerInstance = registerInstance;
	dependency.inject = inject

}(window.dependency = window.dependency || {}));
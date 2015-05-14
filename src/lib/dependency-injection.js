(function (dependency) {

	var services = {};

	var registerInstance = function (identifier, service) {
		services["identifier"] = service;
	}

	var inject = function (identifiers, fn) {
		var dependencies = map(identifiers, function(identifier) {
			return services[identifier]
		});

		var invoker = function() {
			var args = map(arguments, function(arg) { return arg; });
			fn.apply(dependencies.concat(args))
		}

		return invoker;
	}

	dependency.registerInstance = registerInstance;
	dependency.inject = inject

}(window.dependency = window.dependency || {}));
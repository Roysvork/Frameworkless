(function (dependency) {

	var serviceProvider = {};

	var registerInstance = function (identifier, service) {
		serviceProvider[identifier] = function() { return service; }
	}

	var register = function (identifier, serviceProvider) {
		serviceProvider[identifier] = serviceProvider;
	}

	var inject = function (identifiers, fn) {
		var invoker = function() {
			var args = map(arguments, function(arg) { return arg; });
			var dependencies = map(identifiers, function(identifier) {
				return serviceProvider[identifier]();
			});
			
			return fn.apply(this, dependencies.concat(args))
		}

		return invoker;
	}

	dependency.registerInstance = registerInstance;
	dependency.inject = inject

}(window.dependency = window.dependency || {}));
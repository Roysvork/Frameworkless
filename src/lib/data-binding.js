(function (dataBinding) {

	var wrap = function(fn, model) {
		var actions = [];
		var update = function() { 
			var result = fn.bind(model)();
			forEach(actions, function (action) {				
				action(result);
			});
		}

		fn.wrapped = true;
		fn.actions = actions;
		fn.update = update;

		return fn;
	}

	var ensureWrapped = function (model, propertyName) {
		var prop = model[propertyName];
		if (typeof prop == "function") {
			return (prop.wrapped) ? prop : wrap(prop, model);
		}

		var getter = model.__lookupGetter__(propertyName);
		if (getter && getter.wrapped) {
			return getter;
		}

		getter = wrap(function() { return prop }, model);
		Object.defineProperty(model, propertyName, {
			get: getter,
			set: function(newValue) { 
				prop = newValue; 
				getter.update();
			}
		});

		return getter;		
	}

	var toValue = function (value) {
		this.value = value;
	}

	var toText = function (value) {
		this.textContent = value;
	}

	var write = function(fn) {
		return function (model, propertyName, selector) {
			var element = document.querySelectorAll(selector)[0];
			var wrapper = ensureWrapped(model, propertyName);

			wrapper.actions.push(fn.bind(element));
			wrapper.update();
		}
	}

	var fromValue = function(model, selector, propertyName) {
		var element = document.querySelectorAll(selector)[0];
		var action = function (e) {
			model[propertyName] = e.target.value;
		};

		element.addEventListener("change", action);
		action({ target: element });
	}

	var addDependency = function (model, propertyName, dependencyName) {
		var computed = ensureWrapped(model, propertyName);
		var wrapper = ensureWrapped(model, dependencyName);
		wrapper.actions.push(function (newValue) {
			computed.update();
		});

		wrapper.update();
	}

	dataBinding.to = {};
	dataBinding.to.text = write(toText);
	dataBinding.to.value = write(toValue);

	dataBinding.from = {};
	dataBinding.from.value = fromValue;

	dataBinding.addDependency = addDependency;

})(window.dataBinding = window.dataBinding || {})
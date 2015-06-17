(function (dataBinding) {
	
	var wrap = function(fn, model) {
		fn.wrapped = true;
		fn.actions = [];
		fn.update = function() { 
			var result = fn.bind(model)();
			forEach(fn.actions, function (action) {
				action(result);
			});
		};
	
		return fn;
	};

	var ensureWrapped = function (model, propertyName) {
		var property = model[propertyName];
		if (typeof property === "function") {
			return property.wrapped ? property : wrap(property, model);
		}

		var getter = getGetter(model, propertyName);
		if (getter && getter.wrapped) {
			return getter;
		}

		getter = wrap(function() { return property; }, model);
		Object.defineProperty(model, propertyName, {
			get: getter,
			set: function(newValue) { 
				property = newValue;
				getter.update();
			}
		});

		return getter;
	}

	var fromValue = function (model, propertyName, elementSelector) {
		var element = document.querySelector(elementSelector);
		var fn = function (e) {
			model[propertyName] = e.target.value;
		}

		element.addEventListener("change", fn);
		fn({ target: element });
	};

	var toText = function (model, propertyName, elementSelector) {
		var element = document.querySelector(elementSelector);
		var property = ensureWrapped(model, propertyName);

		property.actions.push(function (newValue) {
			element.textContent = newValue;
		});

		property.update();
	};

	var toValue = function (model, propertyName, elementSelector) {
		var element = document.querySelector(elementSelector);
		var property = ensureWrapped(model, propertyName);

		property.actions.push(function (newValue) {
			element.value = newValue;
		});

		property.update();
	};

	var addDependency = function (model, propertyName, dependencyName) {
		var property = ensureWrapped(model, propertyName);
		var dependency = ensureWrapped(model, dependencyName);

		dependency.actions.push(function (newValue) {
			property.update();
		});

		property.update();
	}

	dataBinding.from = {
		value: fromValue
	};

	dataBinding.to = {
		text: toText,
		value: toValue
	};
	
	dataBinding.addDependency = addDependency;

}(window.dataBinding = window.dataBinding || {}));
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

		var getter = getGetter(model, propertyName);
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

	var toChecked = function (value) {
		this.checked = value;
	}

	var toShowHide = function (value) {
		if (value) {
			this.classList.add("hidden");
		}
		else
		{
			this.classList.remove("hidden");
		}
	}

	var toStrikeThrough = function (value) {
		if (value) {							
			this.style.setProperty("text-decoration", "line-through");
		}
		else
		{
			this.style.setProperty("text-decoration", "none");
		}
	};

	var write = function(fn) {
		return function (model, propertyName, selector, container) {
			container = container || document;
			var element = container.querySelectorAll(selector)[0];
			var wrapper = ensureWrapped(model, propertyName);

			wrapper.actions.push(fn.bind(element));
			wrapper.update();
		}
	}

	var fromValue = function(model, selector, propertyName, container) {
		return read(container, selector, "change", function (e) {
			model[propertyName] = e.target.value;
		});
	}

	var fromChecked = function(model, selector, propertyName, container) {
		return read(container, selector, "change", function (e) {
			model[propertyName] = e.target.checked;
		});
	}

	var read = function(container, selector, event, fn) {
		var element = (container || document).querySelector(selector);		
		element.addEventListener(event, fn);
		fn({ target: element });
	}


	var addDependency = function (model, propertyName, dependencyName) {
		var computed = ensureWrapped(model, propertyName);
		var wrapper = ensureWrapped(model, dependencyName);
		wrapper.actions.push(function (newValue) {
			computed.update();
		});

		wrapper.update();
	}

	var observe = function (model, propertyName, fn) {
		var wrapper = ensureWrapped(model, propertyName);
		wrapper.actions.push(function (newValue) {
			fn(newValue);
		})

		wrapper.update();
	}

	var clear = function (model, propertyName) {
		var wrapper = ensureWrapped(model, propertyName);
		wrapper.actions.length = 0;
	}

	dataBinding.observe = observe;

	dataBinding.to = {};
	dataBinding.to.text = write(toText);
	dataBinding.to.value = write(toValue);
	dataBinding.to.checked = write(toChecked);
	dataBinding.to.showHide = write(toShowHide);
	dataBinding.to.strikeThrough = write(toStrikeThrough);

	dataBinding.from = {};
	dataBinding.from.value = fromValue;
	dataBinding.from.checked = fromChecked;

	dataBinding.clear = clear;
	dataBinding.addDependency = addDependency;

})(window.dataBinding = window.dataBinding || {})
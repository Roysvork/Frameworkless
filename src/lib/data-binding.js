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
		var prop = model[propertyName];
		if (typeof prop === "function") {
			return (prop.wrapped) ? prop : wrap(prop, model);
		}

		var getter = getGetter(model, propertyName);
		if (getter && getter.wrapped) {
			return getter;
		}

		getter = wrap(function() { return prop; }, model);
		Object.defineProperty(model, propertyName, {
			get: getter,
			set: function(newValue) { 
				prop = newValue; 
				getter.update();
			}
		});

		return getter;		
	};

	var write = function(fn) {
		return function (model, propertyName, selector, container) {
			container = container || document;
			var element = container.querySelectorAll(selector)[0];
			var property = ensureWrapped(model, propertyName);

			property.actions.push(fn.bind(element));
			property.update();
		};
	};
	
	var read = function(container, selector, event, fn) {
		var element = (container || document).querySelector(selector);		
		element.addEventListener(event, fn);
		fn({ target: element });
	};

	var toValue = function (value) {
		this.value = value;
	};

	var toText = function (value) {
		this.textContent = value;
	};

	var toChecked = function (value) {
		this.checked = value;
	};

	var toShowHide = function (value) {
		if (value) {
			this.classList.remove("hidden");
		}
		else
		{
			this.classList.add("hidden");
		}
	};

	var toStrikeThrough = function (value) {
		if (value) {							
			this.style.setProperty("text-decoration", "line-through");
		}
		else
		{
			this.style.setProperty("text-decoration", "none");
		}
	};

	var toHref = function (value) {
		this.href = value;
	};

	var fromValue = function(model, propertyName, selector, container) {
		return read(container, selector, "change", function (e) {
			model[propertyName] = e.target.value;
		});
	};

	var fromChecked = function(model, propertyName, selector, container) {
		return read(container, selector, "change", function (e) {
			model[propertyName] = e.target.checked;
		});
	};

	var addDependency = function (model, propertyName, dependencyName) {
		var property = ensureWrapped(model, propertyName);
		var dependency = ensureWrapped(model, dependencyName);
		dependency.actions.push(function () {
			property.update();
		});	

		property.update();
	};

	var update = function (model, propertyName) {
		var property = ensureWrapped(model, propertyName);
		property.update();
	}

	var observe = function (model, propertyName, fn) {
		var property = ensureWrapped(model, propertyName);
		property.actions.push(function (newValue) {
			fn(newValue);
		});

		property.update();
	};

	var clear = function (model, propertyName) {
		var property = ensureWrapped(model, propertyName);
		property.actions.length = 0;
	};


	dataBinding.to = {};
	dataBinding.to.text = write(toText);
	dataBinding.to.value = write(toValue);
	dataBinding.to.checked = write(toChecked);
	dataBinding.to.showHide = write(toShowHide);
	dataBinding.to.strikeThrough = write(toStrikeThrough);
	dataBinding.to.href = write(toHref);

	dataBinding.from = {};
	dataBinding.from.value = fromValue;
	dataBinding.from.checked = fromChecked;

	dataBinding.clear = clear;
	dataBinding.update = update;
	dataBinding.observe = observe;
	dataBinding.addDependency = addDependency;

})(window.dataBinding = window.dataBinding || {});
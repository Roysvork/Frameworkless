(function (dataBinding) {

	var toText = function (model, propertyName, selector) {
		var element = document.querySelectorAll(selector)[0];
		var value = model[propertyName];

		Object.defineProperty(model, propertyName, {
			get: function() { return value },
			set: function(newValue) { element.textContent = newValue }
		});

		model[propertyName] = value;
	}

	dataBinding.to = {};
	dataBinding.to.text = toText;

	var fromValue = function(model, propertyName, selector) {
		var element = document.querySelectorAll(selector)[0];
		element.addEventListener("change", function (e) {
			model[propertyName] = e.target.value;
		});
	}

	dataBinding.from = {};
	dataBinding.from.value = fromValue;



})(window.dataBinding = window.dataBinding || {})
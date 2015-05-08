(function (dataBinding) {

	var value = function (model, propertyName, selector) {
		var element = document.querySelectorAll(selector)[0];
		var value = model[propertyName];

		Object.defineProperty(model, propertyName, {
			get: function() { return value },
			set: function(newValue) { element.setAttribute('value', newValue) }
		});

		model[propertyName] = value;
	}

	dataBinding.value = value;

})(window.dataBinding = window.dataBinding || {})
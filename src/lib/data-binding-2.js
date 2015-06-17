(function (dataBinding) {
	
	var fromValue = function (model, propertyName, elementSelector) {
		var element = document.querySelector(elementSelector);
		var fn = function (e) {
			model[propertyName] = e.target.value;
			alert(model[propertyName]);
		}

		element.addEventListener("change", fn);
		fn({ target: element });
	};

	var toText = function (model, propertyName, elementSelector) {

	};

	dataBinding.from = {
		value: fromValue
	};

}(window.dataBinding = window.dataBinding || {}));
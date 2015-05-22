(function (templating) {

	var repeat = function (data, templateSelector) {
		var template = document.querySelector(templateSelector).content;

		var renderTo = function(targetSelector, container, fn) {
			var container = container || document;
			var target = container.querySelector(targetSelector);
			target.innerHTML = "";

			forEach(data, function(item) {
				var element = document.importNode(template, true);
				fn(item, element.firstElementChild);
				target.appendChild(element);
			});
		} 

		return {
			renderTo: renderTo
		};
	}

	templating.repeat = repeat;

}(window.templating = window.templating || {}))
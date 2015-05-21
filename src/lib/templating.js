(function (templating) {

	var repeat = function (data, templateSelector, fn) {
		var template = document.querySelector(templateSelector).content;

		var renderTo = function(targetSelector, container) {
			var container = container || document;
			var target = container.querySelector(targetSelector);
			target.innerHTML = "";
			forEach(data, function(item) {
				fn(item, template);
				target.appendChild(document.importNode(template, true));
			})
		} 

		return {
			renderTo: renderTo
		};
	}

	templating.repeat = repeat;

}(window.templating = window.templating || {}))
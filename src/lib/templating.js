(function (templating) {

	var repeat = function (data, templateSelector, fn) {
		var template = document.querySelector(templateSelector).content;

		var renderTo = function(targetSelector) {
			var target = document.querySelector(targetSelector)
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
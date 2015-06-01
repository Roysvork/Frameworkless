(function (templating) {

	var fluentRepeater = function (_template, _fn) {
		this.template = _template;
		this.fn = _fn;
	};

	fluentRepeater.prototype.render = function (_data) {
		this.data = _data;
		return this;
	};

	fluentRepeater.prototype.to = function (targetSelector, container) {
		container = container || document;
		var target = container.querySelector(targetSelector);
		target.innerHTML = "";

		forEach(this.data, function(item) {
			var element = container.importNode(this.template, true);
			this.fn(item, element.firstElementChild);
			target.appendChild(element);
		}.bind(this));

		return this;
	};

	var repeat = function (templateSelector, fn, container) {
		container = container || document;
		var template = container.querySelector(templateSelector).content;
		return new fluentRepeater(template, fn);
	};

	templating.repeat = repeat;

}(window.templating = window.templating || {}));
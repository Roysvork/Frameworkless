(function (templating) {
	
	var fluentTemplate = function (templateSelector, init) {
		this.template = document.querySelector(templateSelector).content;
		this.init = init;
	};

	fluentTemplate.prototype.render = function (data) {
		this.data = data;
		return this;
	};

	fluentTemplate.prototype.createElement = function (data) {
		var element = document.importNode(this.template, true);
		this.init(element.firstElementChild, data);
		return element;
	};

	var single = function (templateSelector, init) {
		return compose(new fluentTemplate(templateSelector, init), function (tpl) {
			tpl.to = function (targetSelector) {
				var target = document.querySelector(targetSelector);
				target.appendChild(this.createElement(this.data));
			}
		})
	};

	templating.single = single;

}(window.templating = window.templating || {}));
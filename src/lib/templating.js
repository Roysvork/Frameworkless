(function (templating) {

	var fluentTemplate = function (_template, _fn, _action) {
		this.template = _template;
		this.fn = _fn;
		this.action = _action;
	}

	fluentTemplate.prototype.createElement = function (model) {
		return compose(document.importNode(this.template, true), function (el) {
			this.fn(model, el.firstElementChild);
		}.bind(this));
	}

	fluentTemplate.prototype.render = function (_data) {
		this.data = _data;
		return this;
	};

	fluentTemplate.prototype.to = function (targetSelector, container) {
		var target = (container || document).querySelector(targetSelector);
		this.action(target);
	}

	var single = function(templateSelector, fn, container) {
		container = container || document;
		var template = container.querySelector(templateSelector).content;

		return new fluentTemplate(template, fn, function (target) {
			target.appendChild(this.createElement(this.data));
		});
	};

	var repeat = function (templateSelector, fn, container) {
		container = container || document;
		var template = container.querySelector(templateSelector).content;

		return new fluentTemplate(template, fn, function (target) {
			forEach(this.data, function(item) {
				target.appendChild(this.createElement(item));
			}.bind(this));
		});
	};

	templating.single = single;
	templating.repeat = repeat;

}(window.templating = window.templating || {}));
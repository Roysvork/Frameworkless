(function (templating) {

	var fluentTemplate = function (templateSelector, init, container) {
		this.template = (container || document).querySelector(templateSelector).content;
		this.init = init;
	}

	fluentTemplate.prototype.createElement = function (model) {
		var element = document.importNode(this.template, true);
		this.init(element.firstElementChild, model);
		return element;
	}

	fluentTemplate.prototype.render = function (data) {
		this.data = data;
		return this;
	};

	var toSingle = function (targetSelector, container) {
		var target = (container || document).querySelector(targetSelector);
		target.appendChild(this.createElement(this.data));
	};

	var single = function(templateSelector, init, container) {
		return compose(
			new fluentTemplate(templateSelector, init, container),
			function (tpl) { tpl.to = toSingle });
	}

	var toRepeat = function (targetSelector, container) {
		var target = (container || document).querySelector(targetSelector);
		forEach(this.data, function(item) {
			target.appendChild(this.createElement(item));
		}.bind(this));
	}

	var repeat = function(templateSelector, init, container) {
		return compose(
			new fluentTemplate(templateSelector, init, container),
			function (tpl) { tpl.to = toRepeat });
	}

	templating.single = single;
	templating.repeat = repeat;

}(window.templating = window.templating || {}));
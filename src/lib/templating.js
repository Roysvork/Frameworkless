(function (templating) {
	
	var fluentTemplate = function (templateSelector, init) {
		this.template = document.querySelector(templateSelector).content;
		this.init = init;
	};

	fluentTemplate.prototype.createElement = function (data) {
		var element = document.importNode(this.template, true);
		this.init(element.firstElementChild, data);
		return element;
	};

	fluentTemplate.prototype.render = function (data) {
		this.data = data;
		return this;
	};

	var single = function (templateSelector, init) {
		return compose(new fluentTemplate(templateSelector, init), function (tpl) {
			tpl.to = function (targetSelector) {
				var target = document.querySelector(targetSelector);
				target.appendChild(this.createElement(this.data));
			};
		});
	};

	var repeat = function (templateSelector, init) {
		return compose(new fluentTemplate(templateSelector, init), function (tpl) {
			tpl.to = function (targetSelector) {
				var target = document.querySelector(targetSelector);
				target.innerHTML = "";
				forEach(this.data, function (item) {
					target.appendChild(this.createElement(item));					
				}.bind(this));
			};
		});
	};

	templating.single = single;
	templating.repeat = repeat;

}(window.templating = window.templating || {}));
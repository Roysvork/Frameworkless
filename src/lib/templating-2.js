(function (templating) {
	
	var fluentTemplate = function (templateSelector, init) {
		this.template = document.querySelector(templateSelector).content;
		this.init = init;
	};

	fluentTemplate.prototype.render = function (data) {
		
	};

	fluentTemplate.prototype.createElement = function () {

	};

}(window.templating = window.templating || {}));
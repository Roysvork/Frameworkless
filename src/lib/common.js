function ready(fn) {
	if (document.readystate != "loading") {
		fn();
	}
	else {
		document.addEventListener('DOMContentLoaded', fn)
	}
}

function click(selector, fn) {
	var element = document.querySelectorAll(selector)[0];
	element.addEventListener('click', fn);
}

function forEach(obj, fn) {
	for (index in obj) {
		var item = obj[index];
		fn(item);
	}
}

function forEachProperty(obj, fn) {
	for (var property in obj) {
	    if (object.hasOwnProperty(property)) {
	        fn(property);
	    }
	}
}

function map(array, fn) {
	var result = [];
	forEach(array, function (item) {
		result.push(fn(item));
	})
}
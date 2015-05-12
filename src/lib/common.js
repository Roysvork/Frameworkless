function ready(fn) {
	if (document.readystate != "loading") {
		fn();
	}
	else {
		document.addEventListener('DOMContentLoaded', fn)
	}
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
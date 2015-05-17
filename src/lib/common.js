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
	
	return result;
}

function first(array, fn) {
	for (index in array) {
		var item = array[index];
		if (fn(item)) {
			return item;
		}
	}

	return null;
}

var compose = function(obj, fn) {
	fn(obj);
	return obj;
}

var extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
};
function ready(fn) {
	if (document.readystate != "loading") {
		fn();
	}
	else {
		document.addEventListener('DOMContentLoaded', fn)
	}
}

function click(selector, fn, container) {
	var element = (container || document).querySelector(selector);
	element.addEventListener('click', function (e) {
		if (e.target === element) fn(e);
	});
}

function forEach(obj, fn) {
	for (index in obj) {
		var item = obj[index];
		fn(item);
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

var getGetter = function (model, propertyName) {
	return model.__lookupGetter__(propertyName)
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

var operatorOverload = function() {
	var context = {};
	var args = map(arguments, function(o) { return o });

	forEach(args, function(arg) {
		var constructor = arg[0];
		var apply = arg[1];

		constructor.prototype.valueOf = function() {
			context.result = compose(this, function (obj) { 
				if (context.result) {
					apply(context.result, obj);
				}
			});
		};
	})

	return {
		evaluate: function(input) {
			return context.result;
		}
	};
};

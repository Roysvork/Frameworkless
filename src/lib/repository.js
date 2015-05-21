(function (dependency) {

	var items = [];
	var add = function (newItem) {
		items.push(newItem);
	}

	var remove = function (item) {
		var index = items.indexOf(item);
		if (index >= 0) {
			items.splice(index, 1);
		}
	}

	var getAll = function () {
		return items;
	}

	var repository = {};
	repository.add = add;
	repository.remove = remove;
	repository.getAll = getAll;

	dependency.registerInstance('repository', repository)

}(window.dependency));
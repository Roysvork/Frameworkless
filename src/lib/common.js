function ready(fn) {
	if (document.readystate != "loading") {
		fn();
	}
	else {
		document.addEventListener('DOMContentLoaded', fn)
	}
}
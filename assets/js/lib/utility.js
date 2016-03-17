$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

$.iajax = function(url, data, callback, failure) {
	if (typeof callback !== 'function') {
		callback = function() {};
	}

	if (typeof failure !== 'function') {
		failure = function() {};
	}

	$.ajax({
		url: url,
		data: data,
		type: 'POST',
		beforeSend: function() { $.fancybox.showLoading(); }
	}).done(function(response) {
		$.fancybox.hideLoading();
		callback(response);
	}).fail(function(response) {
		$.fancybox.hideLoading();
		failure(response);
	});
};
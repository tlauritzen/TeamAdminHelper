$(document).ready(function() {
    $('.destroy').live('click', function(e) {
	e.preventDefault();
	if (confirm('Are you sure you want to delete that item?')) {
	    var element = $(this);
	    var form = $('<form></form>');
	    form.appendTo($("body"));
	    form
		.attr({
		    method: 'POST',
		    action: element.attr('href')
		})
		.hide()
		.append('<input type="hidden" />')
		.find('input')
		.attr({
		    'name': '_method',
		    'value': 'delete'
		})
		.end()
		.submit();
	}
    });

    $( "#datepicker" ).datepicker();
    $.datepicker.regional
});
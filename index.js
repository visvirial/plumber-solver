
var ps_map_html = function(map) {
	var html = '';
	html += '<div style="margin:10px;">';
	for(var y=0; y<map.length; y++) {
		for(var x=0; x<map[0].length; x++) {
			var name = map[y][x].type + '' + map[y][x].orientation;
			if(x==0 && y==0) name='S';
			html += '<img src="./img/'+name+'.png" alt="'+name+'" style="width:10%;" />';
		}
		html += '<br />';
	}
	html += '</div>';
	return html;
};

var ps_solve = function() {
	var prob = $('textarea#problem').val().trim().split('\n');
	try {
		var ps = new PlumberSolver(prob);
	} catch(e) {
		alert(e.message);
		return;
	}
	$('#image-prob').html(ps_map_html(ps.map));
	var ans = ps.solve();
	console.log(ans);
	if(ans.length == 0) {
		alert('Oops, we chouldn\'t find your answer :(');
	}
	var html = '';
	for(var i=0; i<ans.length; i++) {
		html += '<h3>Distance: '+ans[i].distance+' ('+(i+1)+' of '+ans.length+')</h3>';
		html += ps_map_html(ans[i].map);
	}
	$('#image-answer').html(html);
};

$(document).ready(function() {
	var default_prob = [
		'_LL_ILIL',
		'LLI_LILL',
		'IILLIILL',
		'LLLLLLLI',
		'ILILLIIL',
		'LILLLILL',
		/*
		'_LILL_IL',
		'ILLLIIL_',
		'IILIIILI',
		'LLLLLLIL',
		'LILLIILL',
		'LIIIIIIL',
		*/
	];
	$('textarea#problem').val(default_prob.join('\n'));
	ps_solve();
});


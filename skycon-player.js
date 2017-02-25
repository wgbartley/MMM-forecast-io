var skycon_list = [];
var player_timeout;
var skycons = new Skycons({color:'white'});

skycons.play();

skycon_player();

function skycon_player() {
	clearTimeout(player_timeout);

	document.querySelectorAll('canvas.skycon').forEach(function(icon) {
		if(!in_array(skycon_list, icon.id)) {
			skycons.add(icon.id, Skycons[icon.skycon]);
			skycon_list.push(icon.id);
		}
	});

	player_timeout = setTimeout(skycon_player, 100);
}


function in_array(arr, id) {
	for(var i=0; i<arr.length; i++)
		if(arr[i]===id)
			return true;

	return false;
}

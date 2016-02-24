/*

First exercise from https://developers.google.com/edu/python/exercises/log-puzzle

1.) Read in log file

2.) Find all fields with 'puzzle' in it

3.) avoid duplicated urls

4.) Sort alphabetically 

5.) Download files

6.) Construct HTML file

7.) Profit

*/



var fs = require('fs');
var http = require('request');

var config = {

	exercise_1: 'animal_code.google.com',
	exercise_2: 'place_code.google.com',
	html_file: 'exercise.html',
	image_folder: 'img/',

};
var log_file1 = 'place_code.google.com';
var log_file2 = ''
var html_file = 'place_html.html';










var app = function(exercise_2) {
	
	
	// reads log file
	(function() { 
		setup();
		var log_file = exercise_2 ? config.exercise_2 : config.exercise_1;
		fs.readFile(log_file, 'utf-8', function(err, data) {
			if(err) throw err;
			else parse_file(data);
		});
	})();


	function setup() {
		// if html file exists, delete it otherwise it will append it
if(fs.existsSync(config.html_file)) fs.unlinkSync(config.html_file);

// create img folder if it doesnt exist
if(!fs.existsSync(config.image_folder)) {

	fs.mkdir(config.image_folder, function(e) {
		if(e) throw e;
		else console.log('Created folder img');
	});
}
	}

	function sort_images(list) {
		var tmp = {},
				tmp_array = [];

				// loop through array, get the second word in a string for sorting 
		for(var i in list) {
			var sortable = list[i].split('-')[2];
			tmp[sortable] = list[i];
		}
				// sort alphabetically
				var list =  Object.keys(tmp).sort();
				for(var i in list) {
					// goes through object in a sorted manner.
					if(tmp[list[i]]) tmp_array.push(tmp[list[i]]);
				}
				return tmp_array;
	


	}

	function parse_file(data) {
		var images_array = [];
		// find all fields with puzzle in it
		var regex = data.match(/puzzle\/(.*)/gi);

			// if we are at the last array element continue with file downloading
		(function iterator(index) {
			if(index === regex.length) {
				
			
				if(exercise_2) download_images(sort_images(images_array));
				else download_images(images_array.sort());
			}
			else {
					// remove unwanted part of the url, so we'd get a proper url
				var url = regex[index].split('HTTP')[0];
				if(images_array.indexOf(url) === -1) images_array.push(url);
				iterator(index + 1);

			}
		})(0);


	}

	function download_images(urls) {
		var images = [];
		


		(function iterator(index) {
			if(index == urls.length) {
				

				construct_html(images);
			}
			else {
						// save files into img dir
				var file = fs.createWriteStream(config.image_folder + index + '.jpg');
						file.on('close', function() {
							console.log('Image ' + index + ' download complete!');
							images.push(index + '.jpg');
							iterator(index + 1);
						});

							// download file
				http.get('http://code.google.com/edu/languages/google-python-class/images/' + urls[index]).pipe(file);
								
				
			}
		})(0);

	}

	function construct_html(img_links) {
		fs.appendFile(config.html_file, '<html><body>', null);
		(function iterator(index) {
			if(index === img_links.length) {
				fs.appendFile(config.html_file,'</body></html>',null);
				console.log('Complete!');
			}
			else {
					// write files into html file and voila
				fs.appendFile(config.html_file, '<img src="' + config.image_folder +  img_links[index] + '">', function() {
					iterator(index + 1);
				});

			}

		})(0);
		

	}

};

 // initializing our app

if(!process.argv[2]) {
	console.log('Run as: node google.js --exercise 1 or --exercise 2');
	return false;
}

else if(process.argv[2] == '--exercise' && process.argv[3] == 1) new app(false);
else if(process.argv[2] == '--exercise' && process.argv[3] == 2) new app(true);
else console.log('Invalid command\nRun as: node google.js --exercise 1 or --exercise 2 ')

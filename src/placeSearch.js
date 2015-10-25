window["performSearch"] = function (search, cb) {
	function Location (name, address, id) {
		return { name : name, address : address, id : id };
	}

	var allPlaces = [
		Location("Eskimo Candy",                  "", "ChIJ_Qc53RTQVHkRfpfEHNp1uzg"),
		Location("Mama's Fish House",             "", "ChIJ_Qc53RTQVHkRfpfEHNp2uzg"),
		Location("Kimo's",                        "", "ChIJ_Qc53RTQVHkRfpfEHNp3uzg"),
		Location("Da Kitchen Cafe",               "", "ChIJ_Qc53RTQVHkRfpfEHNp4uzg"),
		Location("Cafe O'Lei Kihei",              "", "ChIJ_Qc53RTQVHkRfpfEHNp5uzg"),
		Location("Sansei Seafood & Sushi Bar",    "", "ChIJ_Qc53RTQVHkRfpfEHNp6uzg"),
		Location("Star Noodle",                   "", "ChIJ_Qc53RTQVHkRfpfEHNp7uzg"),
		Location("Lahaina Grill",                 "", "ChIJ_Qc53RTQVHkRfpfEHNp8uzg"),
		Location("Paia Fish Market",              "", "ChIJ_Qc53RTQVHkRfpfEHNp9uzg"),
		Location("Monkeypod Kitchen by Merriman", "", "ChIJ_Qc53RTQVHkRfpfEHNpauzg"),
		Location("Mala Ocean Tavern",             "", "ChIJ_Qc53RTQVHkRfpfEHNpbuzg"),
		Location("Flatbread Company",             "", "ChIJ_Qc53RTQVHkRfpfEHNpcuzg")
	];

	function find (pl) {
		return pl.name.toLowerCase().indexOf(search.toLowerCase());
	}

	var r = [];

	if (search) {
		r = [];
		for (var i = 0; i < allPlaces.length; i++) 
			if (find(allPlaces[i]) !== -1)
				r.push(allPlaces[i]);

		r = r.sort(function (a, b) {
			return find(a) - find(b);
		});
	}
	else
		r = allPlaces;

	setTimeout(function () {
		cb(r);
	}, 100);
};
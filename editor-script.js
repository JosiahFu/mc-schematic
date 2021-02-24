var saved = true;
var palette_shown = true;
var block = "";
var block_orientation = "north";
var code = "";
var orient_block_types = {
	"piston": "all",
	"piston-ext": "all",
	"piston-head": "all",
	"s-piston": "all",
	"s-piston-ext": "all",
	"s-piston-head": "all",
	"tnt": ["north", "up", "down"],
	"observer": "all",
	"observer side": ["east", "west"],
	"dispenser": "all",
	"dispenser side": "all",
	"dropper": "all",
	"dropper side": "all",
	"torch": ["north", "east", "west", "south", "up"],
	"torch side": ["north", "east", "west", "up", "down"],
	"redstone-d side": ["north", "east", "south", "west"],
	"redstone-d l": ["north", "east"],
	"redstone-d c": ["north", "east", "west", "south"],
	"redstone-d j": ["north", "east", "west", "south"],
	"redstone-t": ["north", "east", "west", "south", "up"],
	"redstone-t side": ["north", "east", "west", "up", "down"],
	"lever": ["north", "east", "south", "west", "up"],
	"button": ["north", "east", "south", "west", "up"],
	"rail straight": ["north", "east"],
	"rail corner": ["north", "east", "south", "west"],
	"rail activator": ["north", "east"],
	"rail detector": ["north", "east"],
	"rail powered": ["north", "east"],
	"repeater": ["north", "east", "south", "west"],
	"repeater side": ["east", "west", "up", "down"],
	"comparator": ["north", "east", "south", "west"],
	"comparator side": ["east", "west", "up", "down"],
	"hopper": ["north", "east", "south", "west", "down"],
	"hopper side": ["east", "south", "west", "up", "down"],
	"chest": ["north", "east", "south", "west"],
	"chest side": ["east", "west", "up"],
	"r-lamp": ["north", "south"],
	"slab": ["north", "south", "up", "down"],
	"sculk-sensor": ["north", "up"],
	"day-detector": ["north", "up"],
	"night-detector": ["north", "up"],
	"trapdoor": "all"
};

function makeTables(height, width, depth) {
	if(document.getElementById("form") != null) {
		document.getElementById("form").remove();
	}
	row = "<tr>"+"<td onclick=\"paint(this);\">".repeat(width)+"</tr>";
	myTable  = "<table>"+row.repeat(height)+"</table>";
	if(depth == 1) {
		document.getElementById("tables").innerHTML = myTable;
	}
	else {
		for(i = 0; i < depth; i++) {
			document.getElementById("tables").innerHTML += "<h2>Layer "+i+"</h2>"+myTable;
		}
	}
	
	if(document.getElementsByTagName("table")[2].offsetWidth > document.body.offsetWidth) {
		document.body.style.width = document.getElementsByTagName("table")[2].offsetWidth.toString()+"px";
	}
}

function togglePalette() {
	document.getElementsByClassName("palette")[0].classList.toggle("collapse")
}

function chooseBlock(tile, blockType) {
	block = blockType;
	document.getElementById("block-palette").getElementsByClassName("selected")[0].classList.remove("selected");
	tile.classList.add("selected");
	
	if(orient_block_types.hasOwnProperty(block)) {
		if(orient_block_types[block] == "all") {
			for (x of document.getElementById("orient-palette").getElementsByTagName("td")) {
				x.classList.remove("disabled");
			}
		}
		else {
			for (x of document.getElementById("orient-palette").getElementsByTagName("td")) {
				x.classList.add("disabled");
			}
			if(!(orient_block_types[block].includes(block_orientation))) {
				chooseOrient(orient_block_types[block][0]);
			}
			for (x of orient_block_types[block]) {
				document.getElementById(x).classList.remove("disabled");
			}
		}
	}
	else {
		for (x of document.getElementById("orient-palette").getElementsByTagName("td")) {
			x.classList.add("disabled");
		}
	}
}

/*for(x=0;x<6;x++) {document.getElementById("orient-palette").getElementsByTagName("td")[x].classList.add("disabled")}*/

function chooseOrient(orient) {
	if(orient_block_types.hasOwnProperty(block)) {
		if(orient_block_types[block] == "all" || orient_block_types[block].includes(orient)) {
			block_orientation = orient;
			document.getElementById("orient-palette").getElementsByClassName("selected")[0].classList.remove("selected");
			document.getElementById(orient).classList.add("selected");
		}
	}
}

function paint(tile) {
	if(orient_block_types.hasOwnProperty(block)) {
		if(orient_block_types[block] == "all" || orient_block_types[block].includes(block_orientation)) {
			tile.className = block+" "+block_orientation;
		}
		else {
			alert("This block can not be placed in that orientation. Try changing the orientation.");
		}
	}
	else {
		tile.className = block;
	}
	
	if(saved){
		saved = false;
	}
}

function setTitle(titleStr) {
	if(titleStr.length == 0) {
		document.title = "MC Schematic";
	}
	else {
		document.title = titleStr+" - MC Schematic";
	}
}

function exportBuild() {
	if(document.getElementById("form") == null) {
		code = "";
		code += document.getElementById("title").value + ";"
		var tables = document.getElementById("tables").getElementsByTagName("table")
		for (x of tables) {
			for (y of x.children[0].children) {
				for (z of y.children) {
					code += z.className;
					if(z != y.lastChild) {
						code += ".";
					}
				}
				if(y != x.children[0].lastChild) {
					code += "/";
				}
			}
			code += ";";
		}
		code += document.getElementById("notes").value.replace(/\n/g, "\\n");
		
		document.getElementById("code").innerHTML = code;
		document.getElementById("popup").classList.remove("hidden");
		saved = true;
	}
}

function importBuild() {
	code = window.prompt("Input save code");
	if (code != null) {
		if(document.getElementById("form") == null) {
			if(confirm("Replace contents of current build?")) {
				while(document.getElementById("tables").children.length > 0) {
					document.getElementById("tables").lastChild.remove();
				}
			}
			else {
				return;
			}
		}
		else {
			document.getElementById("form").remove();
		}
			
		var tiles = []
		var a = code.split(";");
		
		document.getElementById("title").value = a[0];
		setTitle(a.shift())
		
		document.getElementById("notes").value = a.pop().replace(/\\n/g, "\n");
		
		var b = []
		for (x of a) {
			b.push(x.split("/"));
		}
		for (x of b) {
			tiles.push([]);
			for (y of x) {
				tiles[tiles.length-1].push(y.split("."));
			}
		}
		
		makeTables(tiles[0].length, tiles[0][0].length, tiles.length);
			
		var tables = document.getElementById("tables").getElementsByTagName("table")
			
		for(x = 0; x < tiles.length; x++) {
			for(y = 0; y < tiles[x].length; y++) {
				for(z = 0; z < tiles[x][y].length; z++){
					tables[x].children[0].children[y].children[z].className = tiles[x][y][z];
				}
			}
		}
			
		saved = true;
	}
}
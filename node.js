// NODEBACK - A node based background script for HTML5
// Nodeback is a script for web browsers which draws various nodes
// in the background which float in different directions and connect
// with each other occasionally if they get close
// 
// Nodeback uses the HTML5 canvas element to draw these graphics and uses
// javascript to move them around and hold variables about the nodes.
//
// VARIABLES START____________________________
// General Variables
nb_var_container   = null;
nb_var_nodearray   = [];

// Container Variables
nb_cont_colour     = "#000";

// Node variables
nb_node_colour     = "#AAA";
nb_node_size       = 5;
nb_node_amount     = 70;
nb_node_speed      = 0.25;

// Line Variables
nb_line_colour     = "#555";
nb_line_mindist    = 200;
nb_line_width      = 1;

//Canvas variables
nb_canvas          = null;
// VARIABLES END______________________________

// ======================================================================
// Purpose: Checks if jQuery is present in this webpage
// Returns: Returns 0 if jQuery if found, 1 if errors are encountered
// ======================================================================
function nb_func_checkjquery() {
	if(!window.jQuery) {
		console.error("[Nodeback] jQuery is required to function correctly.");
		return false;
	}
	return true;
}

// ======================================================================
// Purpose: Creates the container or finds one present on the page
// Returns: Returns the element for variable assignment
// ======================================================================
function nb_func_initcontainer() {
	// Create or find an existing container
	if ($('#nodeback-container').length > 0) {
		nd_var_container = $('#nodeback-container')[0];
	} else {
		nb_var_container    = document.createElement("canvas");
		nb_var_container.id = "nodeback-container";
	}

	nb_var_container.width  = $(window).width();
	nb_var_container.height = $(window).height();
	nb_var_container.style.position = "fixed";
	nb_var_container.style.zIndex = "-1";
	nb_var_container.style.backgroundColor = nb_cont_colour;

	document.body.insertBefore(nb_var_container, document.body.firstChild);

	nb_canvas = nb_var_container.getContext("2d");

	return nb_var_container;
}

// ======================================================================
// Purpose: Creates all nodes, controlled by variable node_amount
// Returns: 
// ======================================================================
function nb_func_initnodes(n) {
	nb_var_nodearray.length = 0;
	for ( var i = 0 ; i < n ; i++ ) {
		// Create a new node, init coords in screen
		// and given a random velocity
		var nb_tmp_node = new nb_class_node(
			parseInt($(window).width() * Math.random()), 
			parseInt($(window).height() * Math.random()), 
			(Math.random() - 0.5) * nb_node_speed,
			(Math.random() - 0.5) * nb_node_speed
		);
		nb_var_nodearray.push(nb_tmp_node);
	}
}

// ======================================================================
// Purpose: Main loop of nodeback
// Returns: 0 on exit
// ======================================================================
function nb_func_loop() {
	requestAnimationFrame(nb_func_loop);

	for ( var i = 0 ; i < nb_var_nodearray.length ; i++ ){

		if ( nb_var_nodearray[i].xpos < 0 || nb_var_nodearray[i].xpos > $(window).width()) {
			nb_var_nodearray[i].xpeed *= -1; Math.min(Math.max(nb_var_nodearray[i].xpos, 0), $(window).width());
		}
		if ( nb_var_nodearray[i].ypos < 0 || nb_var_nodearray[i].ypos > $(window).height()) {
			nb_var_nodearray[i].ypeed *= -1; Math.min(Math.max(nb_var_nodearray[i].ypos, 0), $(window).height());
		}

		nb_var_nodearray[i].xpos += nb_var_nodearray[i].xpeed;
		nb_var_nodearray[i].ypos += nb_var_nodearray[i].ypeed;

	}

	nb_func_redraw();
}

// ======================================================================
// Purpose: Enumerates all the nodes and draws them on screen
// Returns: 0 on success
// ======================================================================
function nb_func_redraw() {

	// Clear the screen first
	// This is so the previous nodes are not retained
	nb_canvas.clearRect(0, 0, $(window).width(), $(window).height());
	nb_canvas.fillStyle   = nb_node_colour;
	nb_canvas.strokeStyle = nb_line_colour;
	nb_canvas.lineWidth   = nb_line_width;
	
	// Draw Nodes
	for ( var i = 0 ; i < nb_var_nodearray.length ; i++ ) {	
		// Draw lines between nodes
		// We should use pythagorean theorem for this
		// c^2 = a^2 + b^2
		// c^2 = (x1 - x2)^2 + (y1 - y2)^2
		for ( var a = i + 1 ; a < nb_var_nodearray.length ; a++ ) {
			
			var dist = Math.sqrt(
						Math.pow((nb_var_nodearray[i].xpos - nb_var_nodearray[a].xpos), 2) + 
						Math.pow((nb_var_nodearray[i].ypos - nb_var_nodearray[a].ypos), 2)
					    );
			if (dist < nb_line_mindist) {	
				nb_canvas.beginPath();
				nb_canvas.moveTo(nb_var_nodearray[i].xpos, nb_var_nodearray[i].ypos);
				nb_canvas.lineTo(nb_var_nodearray[a].xpos, nb_var_nodearray[a].ypos);
				nb_canvas.stroke();
				nb_canvas.closePath();
			}
		}
		nb_canvas.fillRect(nb_var_nodearray[i].xpos - (nb_node_size / 2), nb_var_nodearray[i].ypos - (nb_node_size / 2), nb_node_size, nb_node_size);
	}
}

// ======================================================================
// Purpose: Class default of node elements
// Returns: Nothing
// ======================================================================
function nb_class_node(xpos, ypos, xpeed, ypeed) {
	this.xpos = xpos;
	this.ypos = ypos;
	this.xpeed = xpeed;
	this.ypeed = ypeed;
}

// ======================================================================
// Purpose: Called when a resize event is detected
// Returns: Nothing
// ======================================================================
function nodeback_func_resize() {
	nb_func_initnodes(nb_node_amount);
	nb_var_container.width = $(window).width();
	nb_var_container.height = $(window).height();
}

// ======================================================================
// Purpose: 
// Returns: 
// ======================================================================
function nb_func_init() {

	// Print out legal information before continuing...
	console.log("[Nodeback] Licenced under WTFPL 2016-2021.");

	if(!nb_func_checkjquery())
		return -1;

	nb_func_initcontainer();

	nb_func_initnodes(nb_node_amount);

	nb_func_loop();

}

$(document).ready (nb_func_init);
$(window).resize(nodeback_func_resize);

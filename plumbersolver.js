/**
 * direction:
 *   0: right
 *   1: down
 *   2: left
 *   3: up
 * orientation for L:
 *   0: L
 *   1: |^
 *   2: ^|
 *   3: _|
 * orientation for I:
 *   0: | (vertical)
 *   1: - (horizontal)
 */

var PlumberSolver = function(problem, width, height, goal_x, goal_y) {
	this.width  = width  || 8;
	this.height = height || 6;
	this.goal_x = goal_x || 8;
	this.goal_y = goal_y || 4;
	this.map = [];
	if(problem.length != this.height) {
		throw new Error('invalid input height!');
	}
	for(var y=0; y<this.height; y++) {
		this.map[y] = [];
		if(problem[y].length != this.width) {
			throw new Error('invalid input width at height y='+y+' ('+problem[y]+')!');
		}
		for(var x=0; x<this.width; x++) {
			if(!problem[y][x].match(/[LI_]/)) {
				throw new Error('invalid input character at ('+x+', '+y+') ('+problem[y]+')!');
			}
			this.map[y][x] = {
				type: problem[y][x],
				orientation: 0,
				fixed: false,
			};
		}
	}
};

PlumberSolver.prototype.cloneMap = function() {
	var map = [];
	for(var y=0; y<this.height; y++) {
		map[y] = [];
		for(var x=0; x<this.width; x++) {
			map[y][x] = Object.assign({}, this.map[y][x]);
		}
	}
	return map;
}

PlumberSolver.prototype._solve = function(cur, ans) {
	// Go to the next position.
	var _cur = Object.assign({}, cur);
	_cur.x += [+1, 0, -1, 0][cur.direction];
	_cur.y += [0, +1, 0, -1][cur.direction];
	_cur.distance++;
	if(_cur.x == this.goal_x && _cur.y == this.goal_y) {
		ans.push({
			map: this.cloneMap(),
			distance: _cur.distance,
		});
		return;
	}
	if(_cur.x < 0 || _cur.x >= this.width || _cur.y < 0 || _cur.y >= this.height) return;
	if(this.map[_cur.y][_cur.x].fixed) return;
	var mapyx = Object.assign({}, this.map[_cur.y][_cur.x]);
	this.map[_cur.y][_cur.x].fixed = true;
	switch(this.map[_cur.y][_cur.x].type) {
		case '_':
			break;
		case 'I':
			this.map[_cur.y][_cur.x].orientation = ((cur.direction + 1) % 2);
			this._solve(_cur, ans);
			break;
		case 'L':
			// turn right.
			_cur.direction =  ((cur.direction + 1) % 4);
			this.map[_cur.y][_cur.x].orientation = ((cur.direction + 2) % 4);
			this._solve(_cur, ans);
			// turn left.
			_cur.direction =  ((cur.direction + 3) % 4);
			this.map[_cur.y][_cur.x].orientation = ((cur.direction + 3) % 4);
			this._solve(_cur, ans);
			break;
		default:
			throw new Error('invalid type!');
	}
	// Rever to the previous state.
	this.map[_cur.y][_cur.x] = mapyx;
};

PlumberSolver.prototype.solve = function() {
	var cur = {
		x: 0,
		y: 0,
		direction: 1,
		distance: 0,
	};
	var ans = [];
	this._solve(cur, ans);
	ans.sort(function(a, b) { return a.distance - b.distance; });
	return ans;
};

PlumberSolver.MAP_STRING = {
	'_': [[
		'   ',
		' + ',
		'   '
	]],
	'I': [[
		'   ',
		'-+-',
		'   '
	], [
		' | ',
		' + ',
		' | '
	]],
	'L': [[
		' | ',
		' +-',
		'   '
	], [
		'   ',
		' +-',
		' | '
	], [
		'   ',
		'-+ ',
		' | '
	], [
		' | ',
		'-+ ',
		'   '
	]],
};

PlumberSolver.prototype.print = function() {
	for(var y=0; y<this.height; y++) {
		var line = ['', '', ''];
		for(var x=0; x<this.width; x++) {
			for(var i=0; i<3; i++) line[i] += PlumberSolver.MAP_STRING[this.map[y][x].type][this.map[y][x].orientation][i];
		}
		if(y == this.goal_y) line[1] += '-G';
		console.log(line.join('\n'));
	}
};


var compile = (function(){

	var process = function(musexpr){
		var comp = new Compiler(musexpr);
		return comp.compile();
	};

	var convert_pitch = function(pitch){
		var mapping = {c:0,d:2,e:4,f:5,g:7,a:9,b:11};
		return 12 + (12 * pitch[1])+ mapping[pitch[0]];
	};

	var note_obj = function(expr, start){
		return { tag:'note',dur:expr.dur,pitch:convert_pitch(expr.pitch),start:start};
	};

	var rest_obj = function(expr, start){
		return { tag:'rest',dur:expr.dur,start:start};
	};

	var Compiler = function(expr){
		this.expr = expr;
		this.start = 0;
	};

	Compiler.prototype.processNote = function(note, start){
		return {endTime : start+note.dur, value : [note_obj(note,start)]};
	};

	Compiler.prototype.processRest = function(rest, start){
		return {endTime : start+rest.dur, value : [rest_obj(rest,start)]};
	};

	Compiler.prototype.processRepeat = function(repeat, startTime){
		var repeats = [];
		var compiled = null;
		for(i=0;i<repeat.count;i++){
			var compiled = this.recCompile(repeat.section);
			this.start = compiled.endTime;
			repeats = repeats.concat(compiled.value);
		}
		return {endTime : compiled.endTime, value : repeats};
	};

	Compiler.prototype.recCompile = function(expr){
		switch(expr.tag){
			case 'rest':
				return this.processRest(expr, this.start);
			case 'note':
				return this.processNote(expr, this.start);
			case 'repeat':
				return this.processRepeat(expr, this.start);
			default :
				var l_part = this.recCompile(expr.left);
				if(expr.tag == 'seq'){
					this.start = l_part.endTime;
				}
				var r_part = this.recCompile(expr.right);
				var e_time = (l_part.endTime > r_part.endTime) ? l_part.endTime : r_part.endTime;
				return {endTime:e_time, value : l_part.value.concat(r_part.value) };
		}
	};

	Compiler.prototype.compile = function(){
		return this.recCompile(this.expr).value;
	};

	return process;

})();

var melody_mus = 
{ tag: 'seq',
left:
	{ tag: 'repeat',
section:
		{ tag: 'seq',
left: { tag: 'note', pitch: 'a4', dur: 250 },
			right: { tag: 'rest', dur: 250 } },
		count: 3 },
	right:
	{ tag: 'par',
left: { tag: 'note', pitch: 'c4', dur: 500 },
			right:
			{ tag: 'seq',
left: { tag: 'note', pitch: 'd4', dur: 500 },
			right: { tag: 'note', pitch: 'f3', dur: 250 } } } };

console.log(melody_mus);
console.log(compile(melody_mus));


var convert_pitch = function(pitch){
	var letter =  pitch.charAt(0);	
	var octave = pitch.charAt(1);
	var mapping = {c:0,d:2,e:4,f:5,g:7,a:9,b:11};
	return 12 + (12 * octave )+ mapping[letter];
}

var note_obj = function(expr, start){
	return { tag:'note',dur:expr.dur,pitch:convert_pitch(expr.pitch),start:start};
};

var rest_obj = function(expr, start){
	return { tag:'rest',dur:expr.dur,start:start};
};

var process_note = function(note, start){
	return {endTime : start+note.dur, value : [note_obj(note,start)]};
}

var process_rest = function(rest, start){
	return {endTime : start+rest.dur, value : [rest_obj(rest,start)]};
}



var compile = function(musexpr){

	var process_repeat = function(repeat, startTime){
		var repeats = [];
		var compiled = null;
		for(i=0;i<repeat.count;i++){
			var compiled = rec_compile(repeat.section);
			start = compiled.endTime;
			repeats = repeats.concat(compiled.value);
		}
		return {endTime : compiled.endTime, value : repeats};
	};

	var rec_compile = function(expr){
		switch(expr.tag){
			case 'rest':
				return process_rest(expr, start);
			case 'note':
				return process_note(expr, start);
			case 'repeat':
				return process_repeat(expr, start);
			default :
				var l_part = rec_compile(expr.left);
				if(expr.tag == 'seq'){
					start = l_part.endTime;
				}
				var r_part = rec_compile(expr.right);
				var e_time = (l_part.endTime > r_part.endTime) ? l_part.endTime : r_part.endTime;
				return {endTime:e_time, value : l_part.value.concat(r_part.value) };
		}
	};


	var start = 0;
	return rec_compile(musexpr).value;
};

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


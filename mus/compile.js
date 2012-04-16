var note_obj = function(expr, start){
  return { tag:'note',dur:expr.dur,pitch:expr.pitch,start:start};
};

var process_note(note, start){
	return {endTime : start+note.dur, value : [note_obj(note,start)]};
}

var process_repeat(repeat, start){
	var repeats = [];
	for(i=0;i<repeat.count;i++){
		repeats.push( note_obj(repeat.section, start*repeat.section.dur) );
	}
	return {endTime : start+repeat.dur*repeat.count, value : repeats};
}

var compile = function(musexpr){

  var rec_compile = function(expr){
    switch(expr.tag){
      case 'note':
				return process_note(expr, start);
      case 'repeat':
				return process_repeats(expr, start);
      default :
        var l_part = rec_compile(expr.left);
        if(expr.tag == 'seq'){
          start = start + l_part.endTime;
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
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));

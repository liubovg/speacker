// var sides = [ 'left', 'rigth'];
// var grammar = '#JSGF V1.0; grammar sides; public <sides> = ' + sides.join(' | ') + ' ;';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var sides = [  'left','right'];
var grammar = '#JSGF V1.0; grammar sides; public <side> = ' + sides.join(' | ') + ' ;';

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');
var position_number = 2;

var sideHTML= '';
sides.forEach(function(v, i){
    console.log(v, i);
    sideHTML += '<span style="background-color: lightgreen; margin: 50px;  font-size: 30px"> ' + v + ' </span>';
});
hints.innerHTML = 'Tap/click then say where it has to move. Try '+'</br>'+ sideHTML + '.';

document.body.onclick = function() {
    recognition.start();
    console.log('Ready to receive a move command.');
};

var shift = function (side) {
    if(side === "left"){
        if(position_number-1>=1) {
            position_number -= 1;
        }
    }
    else if(side === "right"){
        if(position_number+1<=3) {
            position_number += 1;
        }
    }
};

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

    var last = event.results.length - 1;
    var side = event.results[last][0].transcript;


    diagnostic.textContent = 'Result received: ' + side + '.';
    shift();
    document.getElementById('men').className="position_"+position_number;
    // bg.style.backgroundColor = color;
    console.log('Confidence: ' + event.results[0][0].confidence);
};

recognition.onspeechend = function() {
    recognition.stop();
};

recognition.onnomatch = function(event) {
    diagnostic.textContent = "I didn't recognise that side.";
};


recognition.onerror = function(event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
};
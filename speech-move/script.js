// var sides = [ 'left', 'rigth'];
// var grammar = '#JSGF V1.0; grammar sides; public <sides> = ' + sides.join(' | ') + ' ;';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var sides = [  'left','center','right'];
var grammar = '#JSGF V1.0; grammar sides; public <side> = ' + sides.join(' | ') + ' ;';

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
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
hints.innerHTML = 'Say where it has to move. Try '+'</br>'+ sideHTML + '.';

var onRecgnitionStart = function() {
    recognition.start();
    console.log('Ready to receive a move command.');
};

// document.getElementById("command_button").onclick = onRecgnitionStart();

var shift = function (side) {
    switch (side) {
        case 'left' :
            if (position_number - 1 >= 1) {
                position_number -= 1;
            }
            break;
        case 'right' :
            if (position_number + 1 <= 3) {
                position_number += 1;
            }
            break;
        case 'Center' :
            position_number = 2;
            break;
        default :
    }
}

var process_mesage = function(message){
// message.toString().trim();
    var message1 = message.toString().toLocaleLowerCase();
    var arrayOfIndexes = [];
    sides.forEach(function (side) {
        arrayOfIndexes.push(message1.lastIndexOf(side))
    });
    if (arrayOfIndexes.indexOf(Math.max(...arrayOfIndexes)) !== -1) {
        return sides[arrayOfIndexes.indexOf(Math.max(...arrayOfIndexes))];
    }
    else return 'no-match'
}

onRecgnitionStart();

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
    var message = event.results[last][0].transcript;
    var side = process_mesage(message);
    diagnostic.textContent = 'Result received: ' + message + '.';
    shift(side);
    document.getElementById('men').className="position_"+position_number;
    console.log('Confidence: ' + event.results[0][0].confidence);
    console.log('Ready to receive a move command.');
    console.log("on result");
}

recognition.onspeechend = function() {
    console.log("on end")
}

recognition.onnomatch = function(event) {
    diagnostic.textContent = "I didn't recognise that side.";
    console.log("no match")
};


recognition.onerror = function(event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    console.log("on error")
};

recognition.onend = onRecgnitionStart;
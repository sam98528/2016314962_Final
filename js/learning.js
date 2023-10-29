var urlParams = new URLSearchParams(window.location.search);
var hanzi = urlParams.get('hanzi');

var screenWidth = window.innerWidth;
var desiredWidth = 0.9 * screenWidth; // 90% of screen width

var svgElement = document.getElementById('drawingBoard');
svgElement.setAttribute('width', desiredWidth + 'px');
svgElement.setAttribute('height', desiredWidth + 'px');

var writer = HanziWriter.create('drawingBoard', hanzi, {
    width: desiredWidth,
    height: desiredWidth,
    showCharacter: true,
    padding: 5
});
  writer.quiz({
    onMistake: function(strokeData) {
      console.log('Oh no! you made a mistake on stroke ' + strokeData.strokeNum);
      console.log("You've made " + strokeData.mistakesOnStroke + " mistakes on this stroke so far");
      console.log("You've made " + strokeData.totalMistakes + " total mistakes on this quiz");
      console.log("There are " + strokeData.strokesRemaining + " strokes remaining in this character");
    },
    onCorrectStroke: function(strokeData) {
      console.log('Yes!!! You got stroke ' + strokeData.strokeNum + ' correct!');
      console.log('You made ' + strokeData.mistakesOnStroke + ' mistakes on this stroke');
      console.log("You've made " + strokeData.totalMistakes + ' total mistakes on this quiz');
      console.log('There are ' + strokeData.strokesRemaining + ' strokes remaining in this character');
    },
    onComplete: function(summaryData) {
      console.log('You did it! You finished drawing ' + summaryData.character);
      console.log('You made ' + summaryData.totalMistakes + ' total mistakes on this quiz');
    }
  });

  function containsHanzi(text) {
    var regex = /[\u4e00-\u9fa5]/; // Hanzi range in Unicode
    return regex.test(text);
}


document.getElementById('submitButton').addEventListener('click', function(event){
    event.preventDefault(); // Prevent the form from submitting
    var hanzi = document.getElementById('hanziInput').value;
    if(containsHanzi(hanzi)) {
        window.location.href = 'learning.html?hanzi=' + encodeURIComponent(hanzi);
        console.log("correct")
    } else {
        console.log("wrong")
        // Handle non-Hanzi input if needed
    }
});

window.addEventListener('resize', function() {
    var screenWidth = window.innerWidth;
    var desiredWidth = 0.9 * screenWidth; // 90% of screen width

    // Update the SVG size
    var svgElement = document.getElementById('drawingBoard');
    svgElement.setAttribute('width', desiredWidth + 'px');
    svgElement.setAttribute('height', desiredWidth + 'px');

    // Update the HanziWriter instance size
    writer.resize(desiredWidth, desiredWidth);
});
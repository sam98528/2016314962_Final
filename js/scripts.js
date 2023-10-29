const characters = [
    { id: 'cheng', hanzi: '成' },
    { id: 'jun', hanzi: '均' },
    { id: 'guan', hanzi: '馆' },
    { id: 'da', hanzi: '大' },
];

characters.forEach(character => {
    const writer = HanziWriter.create(character.id, character.hanzi, {
        width: 100,
        height: 100,
        padding: 5,
        showOutline: true,
        strokeAnimationSpeed: 5, // 5x normal speed
        delayBetweenStrokes: 10, // milliseconds
    });

    document.getElementById(character.id).addEventListener('click', function() {
        writer.animateCharacter();
    });
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
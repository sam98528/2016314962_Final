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

function containsHanzi(inputString) {
    const hanziPattern = /^[\u4e00-\u9fa5]$/;  // Regular expression to match Hanzi characters
    return hanziPattern.test(inputString);
}

document.getElementById('submitButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting
    
    var hanzi = document.getElementById('hanziInput').value;

    if (containsHanzi(hanzi)) {
        window.location.href = 'learning.html?hanzi=' + encodeURIComponent(hanzi);
    } else {
        alert("한자를 한글자 입력해주세요!");
        document.getElementById('hanziInput').value = '';
        // Handle non-Hanzi input if needed
    }
});

document.getElementById('buttonCheng').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting
        window.location.href = 'learning.html?hanzi=' + encodeURIComponent('成');
});

document.getElementById('buttonJun').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting
        window.location.href = 'learning.html?hanzi=' + encodeURIComponent('均');
});
document.getElementById('buttonGuan').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting
        window.location.href = 'learning.html?hanzi=' + encodeURIComponent('馆');
});
document.getElementById('buttonDa').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting
        window.location.href = 'learning.html?hanzi=' + encodeURIComponent('大');
});
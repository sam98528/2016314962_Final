var urlParams = new URLSearchParams(window.location.search);
var hanzi = urlParams.get('hanzi');

var screenWidth = window.innerWidth;
var maxWidth = 500;
var desiredWidth = Math.min(0.9 * screenWidth, maxWidth);



var svgElement = document.getElementById('drawingBoard');
svgElement.setAttribute('width', desiredWidth + 'px');
svgElement.setAttribute('height', desiredWidth + 'px');
fetch('/2016314962_Final/data/pinyin.txt')
    .then(response => response.text())
    .then(data => {
        parseData(data);
        displayPinyinFromURL();
    });

function parseData(data) {
    const lines = data.split('\n');
    for (let line of lines) {
        if (line.startsWith('U+')) {
            let parts = line.split(':');
            let hanzi = parts[1].split('#')[1].trim();
            let pinyin = parts[1].split('#')[0].trim();
            hanziToPinyinMapping[hanzi] = pinyin;
        }
    }
}

function displayPinyinFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    let hanzi = urlParams.get('hanzi');

    let pinyinOutput = document.getElementById("pinyinOutput");
    if (hanziToPinyinMapping[hanzi]) {
        pinyinOutput.textContent = hanziToPinyinMapping[hanzi];
    } else {
        pinyinOutput.textContent = "Not Found!";
    }
}
var showHanzi = HanziWriter.create('hanzi', hanzi, {
    width: 100,
    height: 100,
    showCharacter: true,
    padding: 5,
    showOutline: true,
    delayBetweenLoops: 3000
});
showHanzi.loopCharacterAnimation();

var writer = HanziWriter.create('drawingBoard', hanzi, {
    width: desiredWidth,
    height: desiredWidth,
    showHintAfterMisses: 1,
    highlightOnComplete: true,
    padding: 5,
});
writer.quiz();

function containsHanzi(inputString) {
    const hanziPattern = /^[\u4e00-\u9fa5]$/;
    return hanziPattern.test(inputString);
}

document.getElementById('submit').addEventListener('click', function (event) {
    event.preventDefault();

    var hanzi = document.getElementById('hanziInput').value;

    if (containsHanzi(hanzi)) {
        window.location.href = 'learning.html?hanzi=' + encodeURIComponent(hanzi);
        console.log("correct");
    } else {
        if (hanzi == '') {
            window.location.href = 'index.html';
        }
        else {
            alert("한자를 한글자 입력해주세요!");
            document.getElementById('hanziInput').value = '';
            document.getElementById('submit').textContent = "홈으로"
        }
    }
});
window.addEventListener('resize', function () {
    var screenWidth = window.innerWidth;
    var desiredWidth = 0.9 * screenWidth;

    var svgElement = document.getElementById('drawingBoard');
    svgElement.setAttribute('width', desiredWidth + 'px');
    svgElement.setAttribute('height', desiredWidth + 'px');

    writer.resize(desiredWidth, desiredWidth);
});



let hanziToPinyinMapping = {};



document.getElementById('cancelQuizButton').addEventListener('click', function (event) {
    writer.setCharacter(hanzi);
    writer.quiz();
});


document.getElementById('hanziInput').addEventListener('input', function () {
    let button = document.getElementById('submit');
    if (this.value.length > 0) {
        button.textContent = "배우기";
    } else {
        button.textContent = "홈으로";
    }
});


document.getElementById('testGoButton').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'test.html?hanzi=' + encodeURIComponent(hanzi);
});


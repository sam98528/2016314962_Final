var urlParams = new URLSearchParams(window.location.search);
var hanzi = urlParams.get('hanzi');

var screenWidth = window.innerWidth;
var maxWidth = 500;
var desiredWidth = Math.min(0.9 * screenWidth, maxWidth);

let hanziToPinyinMapping = {};
var strokeMistakeLookup = {};

var hint = 1;

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
});

var writer = HanziWriter.create('drawingBoard', hanzi, {
    width: desiredWidth,
    height: desiredWidth,
    showHintAfterMisses: 3,
    highlightOnComplete: true,
    padding: 5,
    showOutline: false,
    showCharacter: false,
    leniency: 1.0
});
writer.quiz({
    onMistake: function (strokeData) {
        console.log('Oh no! you made a mistake on stroke ' + strokeData.strokeNum);
        console.log("You've made " + strokeData.mistakesOnStroke + " mistakes on this stroke so far");
        console.log("You've made " + strokeData.totalMistakes + " total mistakes on this quiz");
        console.log("There are " + strokeData.strokesRemaining + " strokes remaining in this character");
    },
    onCorrectStroke: function (strokeData) {
        strokeMistakeLookup[strokeData.strokeNum] = strokeData.mistakesOnStroke;
        console.log('Yes!!! You got stroke ' + strokeData.strokeNum + ' correct!');
        console.log('You made ' + strokeData.mistakesOnStroke + ' mistakes on this stroke');
        console.log("You've made " + strokeData.totalMistakes + ' total mistakes on this quiz');
        console.log('There are ' + strokeData.strokesRemaining + ' strokes remaining in this character');
    },
    onComplete: function (summaryData) {
        console.log('You did it! You finished drawing ' + summaryData.character);
        console.log('You made ' + summaryData.totalMistakes + ' total mistakes on this quiz');
        for (var strokeNum in strokeMistakeLookup) {
            if (strokeMistakeLookup.hasOwnProperty(strokeNum)) {
                var mistakes = strokeMistakeLookup[strokeNum];
                console.log("Stroke Number: " + strokeNum + ", Mistakes: " + mistakes);
            }
        }

        HanziWriter.loadCharacterData(hanzi).then(function (charData) {
            var target = document.getElementById('target');
            for (var i = 0; i < charData.strokes.length; i++) {
                var strokesPortion = charData.strokes.slice(0, i + 1);
                var isLastStroke = i === charData.strokes.length - 1;
                var strokeColor = isLastStroke ? 'red' : undefined;
                renderFanningStrokes(target, strokesPortion, strokeMistakeLookup);
            }
        });
        $('#exampleModal').modal('show');

    }

});

function renderFanningStrokes(target, strokes, strokeMistakeLookup) {
    var container = document.createElement('div');
    container.style.display = 'inline-block';
    container.style.marginRight = '10px';

    var svg = document.querySelector('#hanzi-template').cloneNode(true);
    svg.style.display = 'block';
    svg.removeAttribute('id');
    svg.style.width = '100px';
    svg.style.height = '100px';
    svg.style.border = '1px solid #EEE';
    svg.style.marginBottom = '5px';

    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var transformData = HanziWriter.getScalingTransform(100, 100);
    group.setAttributeNS(null, 'transform', transformData.transform);
    svg.appendChild(group);

    strokes.forEach(function (strokePath, index) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', strokePath);
        if (index == strokes.length - 1) {
            path.style.fill = 'red';
        } else {
            path.style.fill = '#555';
        }
        group.appendChild(path);
    });

    container.appendChild(svg);

    var mistakes = strokeMistakeLookup[strokes.length - 1] || 0;
    var mistakeLabel = document.createElement('p');
    mistakeLabel.style.textAlign = 'center'
    mistakeLabel.innerHTML = "실수: " + mistakes;
    container.appendChild(mistakeLabel);

    target.appendChild(container);
}

document.getElementById('testGoButton').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'test.html?hanzi=' + encodeURIComponent(hanzi);
});

document.getElementById('hanziInput').addEventListener('input', function () {
    let button = document.getElementById('homeButton');
    if (this.value.length > 0) {
        button.textContent = "배우기";
    } else {
        button.textContent = "홈으로";
    }
});

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
            document.getElementById('homeButton').textContent = "홈으로"
            $('#alertModal').modal('hide');
        }
    }
});

document.getElementById('hintButton').addEventListener('click', function (event) {
    event.preventDefault();
    if (hint == 0) {
        alert("힌트 보기 기회가 없습니다.");
    } else {
        showHanzi.animateCharacter();
        hint = 0;
        document.getElementById('hintButton').textContent = '힌트 보기 (0회)';

    }
});


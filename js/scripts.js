const characters = [
    { id: 'cheng', hanzi: '成' },
    { id: 'jun', hanzi: '均' },
    { id: 'guan', hanzi: '馆' },
    { id: 'da', hanzi: '大' },
    { id: 'xue', hanzi: '学' },
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
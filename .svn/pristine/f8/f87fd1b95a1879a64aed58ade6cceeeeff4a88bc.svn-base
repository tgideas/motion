/*global document */
(function() {
    var source = $(".prettyprint.source.linenums");
    var i = 0;
    var lineId;
    var lines;
    var totalLines;
    var anchorHash;

    if (source.length) {
        anchorHash = document.location.hash.substring(1);
        lines = source.find('li');
        totalLines = lines.length;

        for (; i < totalLines; i++) {
            lineId = 'line' + (i + 1);
            lines[i].id = lineId;
            if (lineId === anchorHash) {
                lines[i].className += ' selected';
            }
        }
    }
})();

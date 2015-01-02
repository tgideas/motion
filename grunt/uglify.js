module.exports = {
    options: {
        // the banner is inserted at the top of the output
        banner: '<%= banner%>'
    },
    //for test only
    dist: {
        files: {
            'dist/js/xhogan.min.js': ['dist/js/xhogan.js']
        }
    },
    codemirror: {
        files: {
            'dist/js/codemirror.min.js': ['dist/js/codemirror.js']
        }
    }
};
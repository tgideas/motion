module.exports = {
    first: ['connect','newer:concat','concat_css','copy'],
    second: ['newer:uglify','cssmin', 'newer:imagemin'],
    three:['replace'],
    four:['watch']
};

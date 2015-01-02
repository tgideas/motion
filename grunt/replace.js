module.exports = {
  dist: {
    options: {
      encoding:'utf-8',
      patterns: [
        {
          match: /\<\!--XHOGAN--\>[\S\s]+\<\!--\/XHOGAN--\>/ig,
          replacement: '<script src="dist/js/xhogan.min.js?v=<%= package.version %>"></script>'
        },
        {
          match: /\<\!--XHOGAN_CSS--\>[\S\s]+\<\!--\/XHOGAN_CSS--\>/ig,
          replacement: '<link href="dist/css/docs.css?v=<%= package.version %>" rel="stylesheet"></link>'
        },
        {
          match: /\<\!--CODEMIRROR--\>[\S\s]+\<\!--\/CODEMIRROR--\>/ig,
          replacement: '<script src="dist/js/codemirror.min.js?v=<%= package.version %>"></script>'
        },
        {
          match: "version",
          replacement: '<%= package.version %>'
        },
        {
          match: /DESC/g,
          replacement: '<%= package.description %>'
        },
        {
          match: /KEYWORDS/g,
          replacement: '<%= package.keywords %>'
        },
        {
          match: /TITLE/g,
          replacement: '<%= package.title %>'
        }
      ]
    },
    files: [
      {expand: false, flatten: true, src: ['index-src.html'], dest: 'index.html'}
    ]
  }
};

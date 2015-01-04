module.exports = {
      dist: {
        options: {
          outputDir: 'i18n',
        }
      },
      options: {
        allowHtml:true,
        fileFormat: 'json',
        exclude: ['i18n/','doc/',"assets/","component/","node_modules/"],
        locales: ['en'],
        locale: 'zh',
        localesPath: 'locales'
      }    
};

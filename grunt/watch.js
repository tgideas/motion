module.exports = {
  less: {
    files:["less/**/*.less"],
    tasks:["less"]
  },
  js:{
    files:["js/*.js"],
    tasks:["concat","uglify"]
  },
  build:{
    files:["js/*.js","css/*.css"],
    tasks:["concat","uglify","concat_css","cssmin"]
  }
};

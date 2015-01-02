module.exports = {
  options: {
    // the banner is inserted at the top of the output
    banner: '<%= banner%>'
  },
  dist:{
    src:'<%= concat_css.dist.dest %>',
    dest:'dist/css/docs.css'
  }
};
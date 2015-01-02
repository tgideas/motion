module.exports = {
  development: {
    options: {
      paths: ["assets/dist/css"]
    },
    files: {
      "assets/dist/css/style.debug.css": "assets/less/style.less"
    }
  },
  production: {
    options: {
      paths: ["assets/dist/css"],
      cleancss: true
    },
    files: {
      "assets/dist/css/style.css": "assets/less/style.less"
    }
  }
};
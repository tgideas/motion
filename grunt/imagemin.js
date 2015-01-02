module.exports = {

    options: {
        cache: false
    },

    dist: {
        files: [/*{
            
            expand: true,                // Enable dynamic expansion
            cwd: 'images/',              // src matches are relative to this path
            src: ["*.{png,jpg,gif}"], // Actual patterns to match
            dest: 'dist/images/'            // Destination path prefix
        }*/]
    }
};
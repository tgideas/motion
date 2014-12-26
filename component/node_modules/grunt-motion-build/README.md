# grunt-motion-build

> build motion as your wish

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-motion-build --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-motion-build');
```

## The "motion_build" task

### Overview
In your project's Gruntfile, add a section named `motion_build` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  motion_build: {
    dev: {
      options: {
      },
      files: [
        {
          expand: true,
          cwd: 'src/main/',
          filter : 'isFile',
          src: '**/*',
          dest: 'build/'
        }
      ]
    }
  }
});
```

### Options

相关配置和seajs可一致，当前文件的根目录认为是seajs的根目录

唯一不同的的配置参数为dest

#### options.dest
Type: `String`
Default value: `'build/'`

打包完的代码输出路径.
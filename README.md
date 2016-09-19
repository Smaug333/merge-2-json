# grunt-merge-2-json

> Merges Javascript Objects or key-value pairs to valid Json Object

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-merge-2-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-merge-2-json');
```

## The "merge_2_json" task

### Overview
In your project's Gruntfile, add a section named `merge_2_json` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  merge_2_json: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.lazy
Type: boolean
Default value: `false`

Default takes ` "key": "value" ` pairs as is. May add commas where missing or removes them. Setting to ` true ` allows ` key: value ` pairs without qoutes. They are added by the plugin - leaving values ` true ` and ` false ` without.   


### Usage Examples

#### Default Options
In this example, the default options only add commas where they are mising or removes them on the last value to form proper JSON. 

```js
grunt.initConfig({
  merge_2_json: {
    options: {},
    files: {
      'dest/global.json': ['src/*globals.cfg'],
    },
  },
});
```
#### Input

```js
"key1": "value1",
"key2": false
"key3": "value3",
```
#### Output

```js
"key1": "value1",
"key2": false,
"key3": "value3"
```

#### Custom Options
In this example, the "lazy" option adds qoutes and commas where they are mising or removes comma on the last value to form proper JSON. 

```js
grunt.initConfig({
  merge_2_json: {
    options: {
      lazy: true
    },
    files: {
      'dest/global.json': ['src/*globals.cfg'],
    },
  },
});
```
#### Input

```js
key1: value1,
key2: false
key3: value3,
```
#### Output

```js
"key1": "value1",
"key2": false,
"key3": "value3"
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2016\-09\-19   v0.1.1 lazy option enabled
* 2016\-09\-16   v0.1.0 Release merge-2-json

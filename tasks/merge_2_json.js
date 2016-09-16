/*
 * grunt-merge-2-json
 * https://github.com/Smaug333/grunt-merge-2-json
 *
 * Copyright (c) 2016 Oliver Faro
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('merge_2_json', 'Merges Objects or key-value pairs to valid Json Object', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    }),
    filestring,
    // remove any curly brackets
    regbracketstart = "{",
    regbracketend = "}",
    // select any without quotes and add them
    regquoteskey = /([A-Za-z0-9_\-]+?)\s*:/g,
    regqoutesvalue = /([A-Za-z0-9_\-]+?)\s*(\n|,)/g,
    // select any without comma and add it
    regcomma = /(:\s)(".*")(?!\s*,)/g,

    regexes = [
      regbracketstart,
      regbracketend,
      regquoteskey,
      regqoutesvalue,
      regcomma
    ],
    message = "",
    regreplace = "";

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {


      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        filestring = grunt.file.read(filepath);
        grunt.log.writeln(filepath + "...");
        regexes.map(function(item,index) {

          switch (item) {
            case regbracketstart:
              message = "nothing, everthing fine";
              regreplace = '';
              break;
            case regbracketend:
              message = "nothing, everthing fine";
              regreplace = '';
              break;
            case regquoteskey:
              message = "quotes in key";
              regreplace = '"$1":';
              break;
            case regqoutesvalue:
              message = "quotes in value";
              regreplace = '"$1"$2';
              break;
            case regcomma:
              message = "comma after value";
              regreplace = '$1$2,';
              break;
          }
          
          if(filestring.search(item) >= 0) {
            if( item !== regbracketstart && item !== regbracketend ) {
              grunt.verbose.warn( '\n ' + filepath + ': \nMissing ' + message + '\n');
              grunt.verbose.oklns("...OK\n \n ");
            }
          }

          filestring = filestring.replace(item, regreplace);
        });
        grunt.log.oklns("...OK"); 
        return filestring;
      }).join(grunt.util.normalizelf(''));

      grunt.log.writeln(src);
      
// Handle options.
      // src += options.punctuation;

      // add curly brackets
      src = src.replace(/^/, '{\n' ).replace(/$/, '\n}' );
      // remove last comma
      src = src.replace(/(,)[^,]*(}$)/g, "\n$2");

      grunt.verbose.oklns("Successfully regexed...");

      // Write the destination file.
      src = JSON.parse(src);
      grunt.file.write(f.dest,  JSON.stringify(src, null, 2));

      // Print a success message.
      grunt.log.oklns('File "' + f.dest + '" created.');
    });
  });

};

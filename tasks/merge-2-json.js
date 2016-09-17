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

  grunt.registerMultiTask('merge-2-json', 'Merges Objects or key-value pairs to valid Json Object', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      lazy: false
    }),

    test = (options.lazy)? "true" : "false", 

    filestring,
    desaster = "-1",
    desasterpath = "",
    regumlaut = /[\u00c4-\u02AF]/,
    // remove any curly brackets
    regbracketstart = "{",
    regbracketend = "}",
    // select any without quotes
    regquoteskey = /([A-Za-z0-9_\-]+?)\s*:/g,
    regqoutesvalue = /([A-Za-z0-9_\-]+?)\s*(\s|,|$)/g,
    // select quoted true or false
    regboolean = /(")(true)(")|(")(false)(")/g,
    // select any without comma
    regcomma = /(:\s)(".*")(?!\s*,)/g,

    regexes = [
      regumlaut,
      regbracketstart,
      regbracketend,
      regquoteskey,
      // regqoutesvalue,
      regcomma
    ],
    message = "",
    regreplace = "";

    grunt.log.writeln(test);

    if( options.lazy ) {
      var regindex = regexes.indexOf(regquoteskey);
      regexes.splice(regindex,0,regqoutesvalue);
      regexes.splice(regindex + 1,0,regboolean);
      grunt.log.writeln(regexes[5] + "\n" + regexes[6]);
    }


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
            case regumlaut:
              message = "DON'T use Umlaut!";
              regreplace = '';
              desaster = filestring.search(regumlaut);
              desasterpath = filepath;
              break;
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
              grunt.log.writeln("quoting")
              message = "quotes in value";
              regreplace = '"$1"$2';
              break;
            case regboolean:
              message = "unqouted boolean";
              regreplace = '$2$5';
              break;
            case regcomma:
              message = "comma after value";
              regreplace = '$1$2,';
              break;
          }
          
          if(filestring.search(item) >= 0) {
            if( item !== regbracketstart && item !== regbracketend && item !== regumlaut) {
              grunt.verbose.warn( '\n ' + filepath + ': \nMissing ' + message + '\n');
              grunt.verbose.oklns("...OK\n \n ");
            }
          }
          if( desaster === -1 ) {
            filestring = filestring.replace(item, regreplace);
          }
        });
  
  
        grunt.log.oklns("...OK"); 
        return filestring;
      }).join(grunt.util.normalizelf(''));
      
      // Handle options.
      // src += options.punctuation;

      // add curly brackets
      src = src.replace(/^/, '{\n' ).replace(/$/, '\n}' );
      // remove last comma
      src = src.replace(/(,)[^,]*(}$)/g, "\n$2");

      grunt.verbose.writeln(src)

      if( desaster > -1 ) {
        grunt.fail.warn("Aborted...\n Don't use umlaute in your json!\n see:\n " + desasterpath + '\n' );
      }

      grunt.verbose.oklns("Successfully regexed...");
      // Write the destination file.
      src = JSON.parse(src);
      grunt.file.write(f.dest,  JSON.stringify(src, null, 2));

      // Print a success message.
      grunt.log.oklns('File "' + f.dest + '" created.');
    });
  });

};

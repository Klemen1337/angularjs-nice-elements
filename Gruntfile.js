'use strict';
/**
@toc
2. load grunt plugins
3. init
4. setup variables
5. grunt.initConfig
6. register grunt tasks
*/

var sass = require('node-sass');

module.exports = function (grunt) {

  /**
  Load grunt plugins
  @toc 2.
  */
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');


  // Configurable paths for the application
  var appConfig = {
    src: 'src',
    dist: 'dist'
  };

  /**
  Function that wraps everything to allow dynamically setting/changing grunt options and config later by grunt task. This init function is called once immediately (for using the default grunt options, config, and setup) and then may be called again AFTER updating grunt (command line) options.
  @toc 3.
  @method init
  */
  function init(params) {
    /**
    Project configuration.
    @toc 5.
    */
    grunt.initConfig({
      // Project settings
      yeoman: appConfig,

      ngtemplates: {
        niceElements: {
          src: [
            '<%= yeoman.src %>/components/**/*.html',
            '<%= yeoman.src %>/modals/**/*.html',
          ],
          dest: '.tmp/nice.templates.js',
          options: {
            htmlmin: {
              collapseWhitespace: true,
              preserveLineBreaks: true,
              removeComments: true
            }
          }
        }
      },

      concat: {
        build: {
          src: [
            'src/nice.js',
            'src/components/**/*.js',
            'src/filters/*.js',
            'src/services/*.js',
            'src/modals/**/*.js',
            '.tmp/nice.templates.js'
          ],
          dest: '<%= yeoman.dist %>/nice.js'
        }
      },

      jshint: {
        options: {
          //force: true,
          globalstrict: true,
          //sub: true,
          node: true,
          loopfunc: true,
          browser: true,
          devel: true,
          globals: {
            angular: false,
            $: false,
            moment: false,
            Pikaday: false,
            module: false,
            forge: false
          }
        },
        beforeconcat: {
          options: {
            force: false,
            ignores: ['**.min.js']
          },
          files: {
            src: []
          }
        },
        //quick version - will not fail entire grunt process if there are lint errors
        beforeconcatQ: {
          options: {
            force: true,
            ignores: ['**.min.js']
          },
          files: {
            src: ['**.js']
          }
        }
      },

      uglify: {
        options: {
          mangle: false
        },
        build: {
          files: {
            'dist/nice.min.js': ['dist/nice.js']
          }
        }
      },

      sass: {
        options: {
          implementation: sass,
          sourceMap: true,
          outputStyle: 'expanded'
        },
        dist: {
          files: {
            'dist/style.css': 'src/styles/style.scss'
          }
        }
      },

      // Empties folders to start fresh
      clean: {
        dist: {
          files: [{
            dot: true,
            src: [
              '<%= yeoman.dist %>/',
              '.tmp/'
            ]
          }]
        },
        tmp: '.tmp/'
      },
      cssmin: {
        dev: {
          src: ['dist/style.css'],
          dest: 'dist/style.min.css'
        }
      }
    });


    /**
    register/define grunt tasks
    */
    grunt.registerTask('default', [
      'clean:dist',
      'sass',
      'ngtemplates',
      'concat:build',
      'jshint:beforeconcatQ',
      'cssmin',
      'clean:tmp',
      'uglify:build'
    ]);

  }
  init({}); //initialize here for defaults (init may be called again later within a task)

};
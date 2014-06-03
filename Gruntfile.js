'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        watch: {
            all: {
                files: ['lib/*.*', 'test/**/*.*'],
                tasks: ['default']
            },
        },
        jasmine_node: {
            src: "lib/*.*",
            specNameMatcher: "Spec",
            specFolders: ["test/spec"],
            projectRoot: "test/spec",
            forceExit: true,
        },

        jshint: {
            all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: '.jshintrc',
            }
        },
        browserify: {
            main: {
                src: ['./src/browser/App.js'],
                dest: 'dist/app_bundle_main.js',
                options: {
                    alias: ["./src/browser/App.js:SampleApp"],
                    ignore: ['src/node/**/*.js'],
                },
            },
            src: {
                src: ['src/common/**/*.js', 'src/browser/**/*.js'],
                dest: 'dist/app_bundle.js',
                options: {
                    alias: ["./src/browser/App.js:SampleApp"],
                    externalize: ['src/common/**/*.js', 'src/browser/**/*.js'],
                    ignore: ['src/node/**/*.js'],
                }
            },
            test: {
                src: ['test/spec/common/**/*.js', 'test/spec/browser/**/*.js'],
                dest: 'dist/test_bundle.js',
                options: {
                    external: ['./src/**/*.js'],
                    ignore: ['./node_modules/underscore/underscore.js'],
                }
            },
        },
        jasmine : {
            src : 'dist/crossdomain-xhr.js',
            options : {
                specs : 'test/spec/ajax-spec.js',
                vendor : ['libs/jquery-1.9.1.js', 'libs/underscore.js']
            }
        },
        uglify: {
          options: {
            // the banner is inserted at the top of the output
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
          },
          dist: {
            files: {
              'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
            }
          }
        },
        concat: {
          options: {
            // define a string to put between each file in the concatenated output
            separator: ';'
          },
          dist: {
            // the files to concatenate
            src: ['lib/**/root.js','lib/**/xhr-features.js', 'lib/**/cXHR-setup.js','lib/**/content-loader.js',  'lib/**/http-module.js','lib/**/message-listener.js','lib/**/postmessageData.js','lib/**/sifr.js','lib/**/sifr-messenger.js','lib/**/cXHR.js', ],
            // the location of the resulting JS file
            dest: 'dist/<%= pkg.name %>.js'
          }
        }


    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-concat');


    // Default task.
    grunt.registerTask('default', ['jshint','jasmine', 'concat', 'uglify']);

    grunt.registerTask('bytecodeit', ['concat', 'uglify']);
    grunt.registerTask('testit', ['bytecodeit', 'jasmine']);
};
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            windowevents: {
                src: 'src/windowevents.js',
                dest: 'dist/js/windowevents.js',
                options: {
                    browserifyOptions: {
                        'standalone': 'windowevents'
                    }
                }
            }
        },

        uglify: {
            windowevents: {
                src: 'dist/js/windowevents.js',
                dest: 'dist/js/windowevents.min.js',
                options: {
                    banner: '/*! windowevents.js <% pkg.version %> */\n',
                    report: 'gzip'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['browserify', 'uglify']);
};
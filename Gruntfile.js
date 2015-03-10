module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bower_concat: {
			all: {
				dest: 'assets/bower.combined.js',
				cssDest: 'assets/bower.combined.css',
				bowerOptions: {
					relative: false
				}
			}
		},
		concat: {
			ca_libs : {
				src : [
					'assets/ca/*'
				],
				dest : 'assets/ca.combined.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! CollectiveAccess Providence <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				compress: {
					dead_code     : false	// discard unreachable code
				}
			},
			ca_libs: {
				files: {
					'assets/ca.combined.min.js': ['assets/ca.combined.js']
				}
			},
			bower: {
				files: {
					'assets/bower.combined.min.js': ['assets/bower.combined.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bower-concat');

	// Default task(s).
	grunt.registerTask('default', [ 'bower_concat', 'concat', 'uglify' ]);
};

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bower_concat: {
			all: {
				dest: 'assets/default/bower.combined.js',
				cssDest: 'assets/default/bower.combined.css',
				bowerOptions: {
					relative: false
				},
				exclude: [
					'fullcalendar', 'moment',
					'google-geolocationmarker', 'google-markerclusterer', 'google-pickonmap', 'jquery-timers'
				]
			},
			calendar: {
				dest: 'assets/calendar/fullcalendar.combined.js',
				cssDest: 'assets/calendar/fullcalendar.combined.css',
				bowerOptions: {
					relative: false
				},
				include: [
					'fullcalendar', 'moment'
				]
			},
			google: {
				dest: 'assets/google/google.combined.js',
				cssDest: 'assets/google/google.combined.css',
				bowerOptions: {
					relative: false
				},
				include: [
					'google-geolocationmarker', 'google-markerclusterer', 'google-pickonmap', 'jquery-timers'
				]
			}
		},
		concat: {
			ca_libs : {
				src : [
					'assets/src/ca/*'
				],
				dest : 'assets/default/ca.combined.js'
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
					'assets/default/ca.combined.min.js': ['assets/default/ca.combined.js']
				}
			},
			bower: {
				files: {
					'assets/default/bower.combined.min.js': ['assets/default/bower.combined.js']
				}
			},
			fullcalendar: {
				files: {
					'assets/calendar/fullcalendar.combined.min.js': ['assets/calendar/fullcalendar.combined.js']
				}
			},
			google: {
				files: {
					'assets/google/google.combined.min.js': ['assets/google/google.combined.js']
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

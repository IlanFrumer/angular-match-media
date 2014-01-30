module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.initConfig

    jshint:
      options:
        jshintrc: true

      ngMatchMedia:
        files: { src: 'angular-match-media.js' }

    uglify:
      dist:
        files: 
          'angular-match-media.min.js': 'angular-match-media.js'


  grunt.registerTask 'default', [ 'jshint', 'uglify' ]  
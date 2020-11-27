module.exports = function (grunt) {
  var config = {};

  //src ===============================

  var src;
  config.src = src = {
    sassMain: 'scss/main.scss',
    distFolder: 'public/stylesheets/app.min.css',
    devFolder: 'public/stylesheets/app.dev.css',
    libFolder: 'lib/**/*.js',
    sassFolder: 'scss/**/*.scss',
    spriteCssFolder: 'scss/helpers/_sprite.scss',
    spriteDestImg: 'public/images/sprite/spritesheet.png',
    spriteSrc: 'public/images/min/*.{png,jpg,gif}',
    imageminCwd: 'public/images/',
    imageminDest: 'public/images/min',
    serverPort: 8000
  };

  //Handlebars ===============================

  // var hbs;
  // config.handlebars = hbs = {};

  // hbs.dist = {
  //   options: {
  //     namespace: "myapp.templates",
  //     processName: function (path) {
  //       console.log("=>", path);
  //       return path.replace(/^templates\/(.*?)\.hbs$/, "$1");
  //     }
  //   },
  //   files: {
  //     "tmp/templates.js": "templates/**/*.hbs"
  //   }
  // };

  //Concat ===============================

  var concat
  config.concat = concat = {};

  concat.dev = {
    files: {
      "public/myapp.development.js": [
        "lib/vendor","node_modules/handlebars-runtime/handlebars.runtime.js","tmp/templates.js","lib/**/*.js","calc/**/*.js"
      ]
    }
  };


  //Uglify ===============================

  config.uglify = {
    dist: {
      options: { sourceMap: "public/myapp.production.js.map", report: "gzip" },
      files: {
        "public/myapp.production.js": ["public/myapp.development.js"]
      }
    }
  }

  //Jasmine ===============================

  var jasmine;
  config.jasmine = jasmine = {};

  jasmine.calc = {
    src: "calc/calc.js",
    options: {
      specs: "spec/calc.spec.js"
    }
  };

  //Jshint ===============================

  var jshint;
  config.jshint = jshint = {};


  jshint.dist = {
    options: { jshintrc: ".jshintrc" },
    files: { all: ["lib/main.js", "lib/test.js"] }
  };

  jshint.dev = {
    options: { jshintrc: ".jshintrc.dev" },
    files: { all: ["lib/main.js", "lib/test.js"] }
  };

  //Watch ===============================

  config.watch = {
    scripts: {
      files: ["<%= src.libFolder %>", "<%= src.sassFolder %>", "jade/**/*.jade"],
      tasks: ["dev", "sass:dist"]
      //,tasks: ["dev",'sass:dist']
    }
  }

  //Jade ===============================

  config.jade = {
    compile: {
      options: {
        client: false,
        pretty: true
      },
      files: [{
        cwd: "jade/templates",
        src: "**/*.jade",
        dest: "jade/compiled-templates",
        expand: true,
        ext: ".html"
      }]
    }
  }

  //Sass ===============================

  var sass;
  config.sass = sass = {};

  //distribution
  sass.dist = {
    options: {
      style: "compressed",//noCache: true, //sourceMap: "none",
      update: true
    },
    files: {
      "<%= src.distFolder %>": "<%= src.sassMain %>"
    }
  };

  //development env.
  sass.dev = {
    options: {
      style: "expanded",//lineNumber: true,
    },
    files: {
      "<%= src.devFolder %>": "<%= src.sassMain %>"
    }
  };

  //ScssLint ===============================

  var scsslint;
  config.scsslint = scsslint = {
    allFiles: [
      'scss/core/_base.scss',
    ],
    options: {
      config: 'scss/.scss-lint.yml',
      reporterOutput: '.tmp/scss-lint-report.xml',
      colorizeOutput: true,
      compact: false,
      exclude: [
        'scss/helpers/**/*.scss', 'scss/modules/**/*.scss',
        'scss/pages/**/*.scss', 'scss/vendor/**/*.scss'
      ]
    }
  };

  //Html Minifier ===============================

  var htmlmin;
  config.htmlmin = htmlmin = {};

  htmlmin.dist = {
    options: {
      collapseWhitespace: true,
      conservativeCollapse: true,
      // minifyCSS: true,
      // minifyJS: true,
      removeAttributeQuotes: true,
      removeComments: true
    },
    files: {
      'layout.min.html': 'jade/compiled-templates/layout.html'
    }
  };

  //Image min ===============================
  var imagemin;
  config.imagemin = imagemin = {};

  imagemin.dist = {
    options: {
      optimizationLevel: 5,
      progressive: true,
    },

    files: [{
      expand: true,
      cwd: '<%= src.imageminCwd %>',
      src: ['**/*.{png,jpg,gif}'],
      dest: '<%= src.imageminDest %>'
    }]
  };

  //Sprite ===============================

  var sprite;
  config.sprite = sprite = {};

  sprite.dist = {
    src: '<%= src.spriteSrc %>',
    dest: '<%= src.spriteDestImg %>',
    destCss: '<%= src.spriteCssFolder %>'

  };

  //grunt serve ===============================
  
  config.connect = {
    server: {
      options: {
        livereload: true,
        port: "<%= src.serverPort %>"
      }
    }
  };


  //Register custom tasks ===============================
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['concat:dev', 'sass:dev', 'jasmine']);
  grunt.registerTask('dist', ['sprite', 'imagemin', 'concat:dev', 'uglify', 'sass:dist']);
  grunt.registerTask('serve', ['connect:server', 'watch']);
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });


  //General setup ===============================
  grunt.initConfig(config);

};

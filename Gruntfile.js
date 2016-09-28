module.exports = function(grunt){
    var pkg = require('./package.json'), // package file
        i;

    grunt.initConfig({
        concurrent: {
            dev: ['nodemon:dev', 'watch:dev'],
            options: {
                logConcurrentOutput: true
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    watch: ['server'],
                    delay: 300
                }
            },
            dist: {
                script: 'server.js'
            }
        },
        stylus: {
            compile: {
                options: {
                    compress: true
                },
                files: {
                    'public/css/styles.min.css': ['public/css/all.styl']
                }
            }
        },
        clean:{
            dist:['public/dist', 'index.html']
        },
        ngtemplates:{
            app:{
                src: ['public/app/**/*.html'],
                dest: 'public/dist/js/templates.js',
                options:{
                    htmlmin:{
                        collapseWhitespace:true,
                        keepClosingSlash:true
                    }
                }
            }
        },
        concat:{
            options:{
                stripBanners:true,
                process:true
            },
            app:{
                src:[
                    'public/app/app.js',
                    'public/app/**/!(app).js'
                ],
                dest:'public/dist/js/scripts.js'
            },
            vendor: {
                src:[
                    'public/vendor/jquery/dist/jquery.min.js',
                    'public/vendor/angular/angular.min.js',
                    'public/vendor/angular-resource/angular-resource.min.js',
                    'public/vendor/angular-route/angular-route.min.js',
                    'public/vendor/angular-csv-import/dist/angular-csv-import.min.js',
                ],
                dest:'public/dist/js/vendor.js'
            }

        },
        uglify:{
            options:{
                mangle:false,
                report:'min',
                wrap:true,
                compress:{
                    dead_code:true,
                    drop_debugger:true,
                    sequences:true,
                    properties:true,
                    comparisons:true,
                    evaluate:true,
                    booleans:true,
                    loops:true,
                    unused:true,
                    if_return:true,
                    join_vars:true,
                    cascade:true,
                    warnings:true
                }
            },
            app:{
                options:{
                    report:'gzip'
                },
                files:{
                    'public/dist/js/app.min.js':[
                        'public/dist/js/vendor.js',
                        'public/dist/js/scripts.js',
                        'public/dist/js/templates.js'
                    ]
                }
            }
        },
        jade: {
            compile: {
                options: {
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'public/app',
                        src: '**/*.jade',
                        dest: 'public/app/',
                        ext: '.html'
                    },
                    {
                        'index.html': ['index.jade']
                    }
                ]
            }
        },
        processhtml: {
            dist: {
                options: {
                    process: true
                },
                files: {
                    'index.html': ['index.html']
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    src: ['public/img/*.{png,jpg,gif}'],
                    dest: 'compressed'
                }]
            }
        },
        watch: {
            dev: {
                files: ['public/**/*.styl', 'public/**/*.jade', 'index.jade'],
                tasks: ['stylus', 'clean:dist', 'jade', 'ngtemplates']
            }
        }
    });

    for(i in pkg.devDependencies){ //iterate through the development dependencies
        if(pkg.devDependencies.hasOwnProperty(i)){ //avoid iteration over inherited object members
            if(i.substr(0,6) == 'grunt-'){ //only load development dependencies that being with "grunt-""
                grunt.loadNpmTasks(i); //load all grunt tasks
            }
        }
    }

    grunt.registerTask('dev',[ 'stylus', 'clean:dist', 'jade','ngtemplates']);
    grunt.registerTask('dist',[ 'stylus', 'clean:dist','concat', 'jade', 'processhtml','ngtemplates', 'uglify:app']);
};

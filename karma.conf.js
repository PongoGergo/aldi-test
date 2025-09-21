module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
          'src/app/app.spec.ts',
          'src/app/**/spec.ts'
        ],
        preprocessors: {
            'src/app/app.spec.ts': ['typescript'],
            'src/app/**/spec.ts': ['typescript']
        },
        reporters: ['progress'],
        browsers: ['Chrome'],
        singleRun: true,
        typescriptPreprocessor: {
            options: {
                sourceMap: true
            }
        }
    });
};

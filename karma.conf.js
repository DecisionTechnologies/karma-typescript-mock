var reporters = ["progress", "karma-typescript"];

const teamcity = process.env['TEAMCITY_VERSION'] != undefined;
if (teamcity) {
    console.log("teamcity detected (TEAMCITY_VERSION environment variable is set)");
    reporters.unshift('teamcity');
}

module.exports = function (config) {
    config.set({

        frameworks: ["jasmine", "karma-typescript"],

        files: [
            { pattern: "src/**/*.ts" }
        ],

        preprocessors: {
            "src/**/*.ts": ["karma-typescript"]
        },

        reporters: reporters,

        browsers: ["Chrome"],

        karmaTypescriptConfig: {
            compilerOptions: {
                sourceMap: false,
                target: 'es6'

            }, bundlerOptions: {
                "exclude": [
                    "node_modules"
                ]
            },
            coverageOptions: {
                instrumentation: true,
                exclude: (config.coverage || teamcity) ? /spec.ts/i : /.ts/i,
            }
        }
    });
};

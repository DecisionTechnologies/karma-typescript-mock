"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var karma_typescript_mock_1 = require("./karma-typescript-mock");
var mocker;
var initaliseMock = function () {
    if (!mocker)
        mocker = new karma_typescript_mock_1.KarmaTypescriptMocker();
    return mocker;
};
exports.JasmineKarmaTypeScriptMocker = function (filename, getMocks) {
    if (getMocks === void 0) { getMocks = {}; }
    initaliseMock();
    var restore;
    beforeEach(function () { return restore = mocker.mock(filename, getMocks); });
    afterEach(function () { return restore(); });
};
exports.JasmineKarmaTypeScriptMockerSingle = function (filename, moduleName, mock) {
    initaliseMock();
    var restore;
    beforeEach(function () { return restore = mocker.mockExport(filename, moduleName, mock); });
    afterEach(function () { return restore(); });
};

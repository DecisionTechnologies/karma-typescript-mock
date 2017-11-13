"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KarmaTypescriptMocker = /** @class */ (function () {
    function KarmaTypescriptMocker(_activeDependencies, _console) {
        if (_console === void 0) { _console = window.console; }
        this._activeDependencies = _activeDependencies;
        this._console = _console;
        this._storedOriginalDependencies = {};
    }
    KarmaTypescriptMocker.prototype.mockExport = function (importName, exportName, mock) {
        var _this = this;
        var foundFilename;
        var imports = this.getImports();
        for (var depFileName in imports) {
            var importing = imports[depFileName];
            if (this.dependencyFilenameMatchesImportName(importName, importing)) {
                foundFilename = depFileName;
                var stored = this.storeOriginalExport(foundFilename, exportName, importing);
                if (stored)
                    this.setPropertyForDependency(importing, exportName, mock);
                break;
            }
        }
        if (!foundFilename)
            this.ErrorCouldNotFindModule(importName);
        return function () { return _this.restoreDepdenencyExport(foundFilename, exportName); };
    };
    KarmaTypescriptMocker.prototype.mock = function (importName, mockedImports) {
        var _this = this;
        var foundFilename;
        var savedExportNames = [];
        var imports = this.getImports();
        for (var depFileName in imports) {
            var importing = imports[depFileName];
            if (this.dependencyFilenameMatchesImportName(importName, importing)) {
                foundFilename = depFileName;
                for (var exportName in mockedImports) {
                    var mock = mockedImports[exportName];
                    var stored = this.storeOriginalExport(foundFilename, exportName, importing);
                    if (stored) {
                        this.setPropertyForDependency(importing, exportName, mock);
                        savedExportNames.push(exportName);
                    }
                }
                break;
            }
        }
        if (!foundFilename)
            this.ErrorCouldNotFindModule(importName);
        return function () { return savedExportNames.forEach(function (exportName) { return _this.restoreDepdenencyExport(foundFilename, exportName); }); };
    };
    KarmaTypescriptMocker.prototype.RestoreAll = function () {
        var _this = this;
        var _loop_1 = function (filename) {
            var module = this_1._storedOriginalDependencies[filename];
            Object.keys(module.exports).forEach(function (exportName) { return _this.restoreDepdenencyExport(filename, exportName); });
        };
        var this_1 = this;
        for (var filename in this._storedOriginalDependencies) {
            _loop_1(filename);
        }
        this._storedOriginalDependencies = {};
    };
    KarmaTypescriptMocker.prototype.ErrorCouldNotFindModule = function (importName) { this._console.error("Could not " + (importName instanceof RegExp ? "Match" : "Find") + " " + importName + " in \n" + this.importListToMatchOrEqualAgainst().join('\n')); };
    KarmaTypescriptMocker.prototype.getImports = function () {
        return this._activeDependencies || window.__karmaTypescriptModules__;
    };
    KarmaTypescriptMocker.prototype.restoreDepdenencyExport = function (filename, exportName) {
        this.getImports()[filename].exports[exportName] = this._storedOriginalDependencies[filename].exports[exportName];
        delete this._storedOriginalDependencies[filename].exports[exportName];
    };
    KarmaTypescriptMocker.prototype.storeOriginalExport = function (filename, exportName, importing) {
        if (!this._storedOriginalDependencies[filename])
            this._storedOriginalDependencies[filename] = { exports: {} };
        var gotit = exportName in importing.exports;
        if (!gotit) {
            this._console.error("Could not find " + exportName + " in " + filename + " \n " + JSON.stringify(importing));
            return false;
        }
        this._storedOriginalDependencies[filename].exports[exportName] = importing.exports[exportName];
        return true;
    };
    KarmaTypescriptMocker.prototype.setPropertyForDependency = function (importing, exportName, value) {
        importing.exports[exportName] = (typeof value == "function") ? value() : value;
    };
    KarmaTypescriptMocker.prototype.importListToMatchOrEqualAgainst = function () {
        var imports = this.getImports();
        var result = [];
        for (var importName in imports) {
            result = result.concat(this.GetVerionsOfFile(imports[importName]));
        }
        return result;
    };
    KarmaTypescriptMocker.prototype.GetDependencyWithoutBasePath = function (dependencyFileName) {
        if (!this._basePath) {
            for (var importName in this.getImports()) {
                if (/node_modules/.test(importName)) {
                    this._basePath = importName.substring(0, importName.indexOf('node_modules'));
                    break;
                }
            }
        }
        return dependencyFileName.replace(this._basePath, '');
    };
    KarmaTypescriptMocker.prototype.RemoveTsOrJsExtension = function (dependencyName) {
        return dependencyName.substring(0, dependencyName.length - 3);
    };
    KarmaTypescriptMocker.prototype.SrcToDotSlash = function (dependencyName) {
        return "." + dependencyName.substring(3);
    };
    KarmaTypescriptMocker.prototype.GetVerionsOfFile = function (importing) {
        var dependencyFileName = importing.id;
        if (/node_modules/.test(dependencyFileName)) {
            var path = dependencyFileName.split('/'), nodeModulePath = path[1];
            if (nodeModulePath.indexOf("@") == 0)
                nodeModulePath = nodeModulePath + "/" + path[2];
            return [nodeModulePath];
        }
        var result = [dependencyFileName];
        if (importing.id != importing.uri && importing.uri != dependencyFileName)
            result.push(importing.uri);
        var importNameWithoutbasePath = this.GetDependencyWithoutBasePath(dependencyFileName);
        var importNameWithoutBaseOrExtension = this.RemoveTsOrJsExtension(importNameWithoutbasePath);
        result.push(importNameWithoutbasePath);
        result.push(importNameWithoutBaseOrExtension);
        result.push('./' + importNameWithoutbasePath);
        result.push('./' + importNameWithoutBaseOrExtension);
        if (importNameWithoutbasePath.startsWith('src/')) {
            result.push(this.SrcToDotSlash(importNameWithoutbasePath));
            result.push(this.SrcToDotSlash(importNameWithoutBaseOrExtension));
        }
        return result;
    };
    KarmaTypescriptMocker.prototype.dependencyFilenameMatchesImportName = function (mockFilename, importing) {
        var allImportedVariants = this.GetVerionsOfFile(importing);
        for (var i = 0; i < allImportedVariants.length; i++) {
            var name_1 = allImportedVariants[i];
            if (mockFilename instanceof RegExp && mockFilename.test(name_1) || name_1 === mockFilename) {
                return true;
            }
        }
        return false;
    };
    return KarmaTypescriptMocker;
}());
exports.KarmaTypescriptMocker = KarmaTypescriptMocker;

declare global {
    interface Window {
        __karmaTypescriptModules__: ICommonJsModules,
        __karma__: any
    }
}

export interface ICommonJsModules {
    [filename: string]: ICommonJsModule;
}

export interface IDependencyItem {
    [exportName: string]: any;
}

export interface ICommonJsModule {
    exports: IDependencyItem,
    id?: string,
    uri?: string
}

export class KarmaTypescriptMocker {
    private _storedOriginalDependencies: ICommonJsModules = {}
    private _basePath: string;
    constructor(private _activeDependencies?: ICommonJsModules, private _console: Console = window.console) {
    }

    mockExport(importName: RegExp | string, exportName: string, mock: () => any | any) {
        var foundFilename: string;
        let imports = this.getImports();
        for (let depFileName in imports) {
            let importing = imports[depFileName];

            if (this.dependencyFilenameMatchesImportName(importName, importing)) {
                foundFilename = depFileName;
                var stored = this.storeOriginalExport(foundFilename, exportName, importing);
                if (stored) this.setPropertyForDependency(importing, exportName, mock)
                break;
            }
        }

        if (!foundFilename) this.ErrorCouldNotFindModule(importName);
        return () => this.restoreDepdenencyExport(foundFilename, exportName);
    }

    mock(importName: RegExp | string, mockedImports: IDependencyItem): () => void {
        var foundFilename: string;
        var savedExportNames: string[] = [];
        let imports = this.getImports();
        for (let depFileName in imports) {
            let importing = imports[depFileName];
            if (this.dependencyFilenameMatchesImportName(importName, importing)) {
                foundFilename = depFileName;
                for (let exportName in mockedImports) {
                    let mock = mockedImports[exportName];
                    var stored = this.storeOriginalExport(foundFilename, exportName, importing);
                    if (stored) {
                        this.setPropertyForDependency(importing, exportName, mock)
                        savedExportNames.push(exportName);
                    }
                }
                break;
            }
        }
        if (!foundFilename) this.ErrorCouldNotFindModule(importName);
        return () =>  savedExportNames.forEach(exportName => this.restoreDepdenencyExport(foundFilename, exportName));
    }

    RestoreAll() {
        for (let filename in this._storedOriginalDependencies) {
            let module = this._storedOriginalDependencies[filename];
            Object.keys(module.exports).forEach(exportName => this.restoreDepdenencyExport(filename, exportName))
        }
        this._storedOriginalDependencies = {};
    }

    private ErrorCouldNotFindModule(importName: RegExp | string ){ this._console.error(`Could not ${importName instanceof RegExp ? "Match" : "Find"} ${importName} in \n${this.importListToMatchOrEqualAgainst().join('\n')}`)}
    private getImports(): ICommonJsModules {
        return this._activeDependencies || window.__karmaTypescriptModules__;
    }

    private restoreDepdenencyExport(filename: string, exportName: string) {
        this.getImports()[filename].exports[exportName] = this._storedOriginalDependencies[filename].exports[exportName];
        delete this._storedOriginalDependencies[filename].exports[exportName];
    }

    private storeOriginalExport(filename: string, exportName: string, importing: ICommonJsModule): boolean {
        if (!this._storedOriginalDependencies[filename]) this._storedOriginalDependencies[filename] = { exports: {} as IDependencyItem }
        var gotit = exportName in importing.exports;
        if (!gotit) { this._console.error(`Could not find ${exportName} in ${filename} \n ${JSON.stringify(importing)}`); return false; }
        this._storedOriginalDependencies[filename].exports[exportName] = importing.exports[exportName];
        return true;
    }

    private setPropertyForDependency(importing: ICommonJsModule, exportName: string, value: any) {
        importing.exports[exportName] = (typeof value == "function") ? value() : value
    }

    private importListToMatchOrEqualAgainst() {
        let imports = this.getImports();
        var result = []
        for (let importName in imports) {
            result = result.concat(this.GetVerionsOfFile(imports[importName]))
        }
        return result;
    }


    private GetDependencyWithoutBasePath(dependencyFileName: string) {
        if (!this._basePath) {
            for (let importName in this.getImports()) {
                if (/node_modules/.test(importName)) {
                    this._basePath = importName.substring(0, importName.indexOf('node_modules'))
                    break;
                }
            }
        }
        return dependencyFileName.replace(this._basePath, '');
    }

    private RemoveTsOrJsExtension(dependencyName: string) {
        return dependencyName.substring(0, dependencyName.length - 3)
    }

    private SrcToDotSlash(dependencyName: string) {
        return `.${dependencyName.substring(3)}`
    }

    private GetVerionsOfFile(importing: ICommonJsModule): string[] {
        let dependencyFileName = importing.id;
        if (/node_modules/.test(dependencyFileName)) {
            let path = dependencyFileName.split('/')
            return [path[1]];
        }
        let result = [dependencyFileName]
        if (importing.id != importing.uri && importing.uri != dependencyFileName) result.push(importing.uri);
        let importNameWithoutbasePath = this.GetDependencyWithoutBasePath(dependencyFileName)
        let importNameWithoutBaseOrExtension = this.RemoveTsOrJsExtension(importNameWithoutbasePath);
        result.push(importNameWithoutbasePath)
        result.push(importNameWithoutBaseOrExtension)
        result.push('./' + importNameWithoutbasePath)
        result.push('./' + importNameWithoutBaseOrExtension)
        if (importNameWithoutbasePath.startsWith('src/')) {
            result.push(this.SrcToDotSlash(importNameWithoutbasePath))
            result.push(this.SrcToDotSlash(importNameWithoutBaseOrExtension))
        }

        return result;
    }

    private dependencyFilenameMatchesImportName(mockFilename: RegExp | string, importing: ICommonJsModule): boolean {
        let allImportedVariants = this.GetVerionsOfFile(importing);
        for (let i = 0; i < allImportedVariants.length; i++) {
            let name = allImportedVariants[i];
            if (mockFilename instanceof RegExp && mockFilename.test(name) || name === mockFilename) {
                return true;
            }
        }
        return false
    }

}
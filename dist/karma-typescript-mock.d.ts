declare global  {
    interface Window {
        __karmaTypescriptModules__: ICommonJsModules;
        __karma__: any;
    }
}
export interface ICommonJsModules {
    [filename: string]: ICommonJsModule;
}
export interface IDependencyItem {
    [exportName: string]: any;
}
export interface ICommonJsModule {
    exports: IDependencyItem;
    id?: string;
    uri?: string;
}
export declare class KarmaTypescriptMocker {
    private _activeDependencies;
    private _console;
    private _storedOriginalDependencies;
    private _basePath;
    constructor(_activeDependencies?: ICommonJsModules, _console?: Console);
    mockExport(importName: RegExp | string, exportName: string, mock: () => any | any): () => void;
    mock(importName: RegExp | string, mockedImports: IDependencyItem): () => void;
    RestoreAll(): void;
    private ErrorCouldNotFindModule(importName);
    private getImports();
    private restoreDepdenencyExport(filename, exportName);
    private storeOriginalExport(filename, exportName, importing);
    private setPropertyForDependency(importing, exportName, value);
    private importListToMatchOrEqualAgainst();
    private GetDependencyWithoutBasePath(dependencyFileName);
    private RemoveTsOrJsExtension(dependencyName);
    private SrcToDotSlash(dependencyName);
    private GetVerionsOfFile(importing);
    private dependencyFilenameMatchesImportName(mockFilename, importing);
}
export {};

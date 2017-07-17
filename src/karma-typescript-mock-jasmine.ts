import { KarmaTypescriptMocker, IDependencyItem } from "./karma-typescript-mock";

var mocker: KarmaTypescriptMocker;
const initaliseMock = (): KarmaTypescriptMocker =>{
    if(!mocker)  mocker = new KarmaTypescriptMocker();
    return mocker;
}


export const JasmineKarmaTypeScriptMocker = (filename: RegExp | string, getMocks: IDependencyItem = {}) =>{
    initaliseMock();
    var restore;
    beforeEach(() => restore = mocker.mock(filename, getMocks))
    afterEach(()=> restore())
}

export const JasmineKarmaTypeScriptMockerSingle = (filename: RegExp | string, moduleName: string, mock: ()=>any) =>{
    initaliseMock();
    var restore;
    beforeEach(() => restore = mocker.mockExport(filename, moduleName, mock))
    afterEach(()=> restore())
}
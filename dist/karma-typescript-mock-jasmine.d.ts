import { IDependencyItem } from "./karma-typescript-mock";
export declare const JasmineKarmaTypeScriptMocker: (filename: string | RegExp, getMocks?: IDependencyItem) => void;
export declare const JasmineKarmaTypeScriptMockerSingle: (filename: string | RegExp, moduleName: string, mock: () => any) => void;

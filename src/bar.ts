import { FooClass, fooFunc } from "./folder/foo";

export const barFunc = () => fooFunc()
export interface IBarClass {
    barFunc(),
    barString: string
}
export class BarClass implements IBarClass {
    constructor(private _foo = new FooClass()){}
    barFunc(){ return this._foo.fooFunc()}
    barString = this._foo.fooString;
}
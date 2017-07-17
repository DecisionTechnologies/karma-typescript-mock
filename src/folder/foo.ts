

import { barFunc, BarClass } from "../bar";

export const fooFunc = () => barFunc();
export interface IFooClass {
    fooFunc(),
    fooString: string
}
export class FooClass implements IFooClass{
    constructor(private _bar = new BarClass()){}
    fooFunc(){ return this._bar.barFunc()}
    fooString = this._bar.barString;
}
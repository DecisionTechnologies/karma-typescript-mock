
import { KarmaTypescriptMocker, IDependencyItem } from "../karma-typescript-mock";
import { IBarClass } from "../bar";
import { fooFunc, FooClass } from "./foo";

describe('foo.ts', () => {

        const mocker = new KarmaTypescriptMocker(), barClassString = "fooMockClassString";
        var restore, barFuncSpy, barClassFuncSpy;
        beforeEach(() => {
            barFuncSpy = jasmine.createSpy('barFuncSpy')
            barClassFuncSpy = jasmine.createSpy('barClassFuncSpy')
            class MockBar implements IBarClass {
                barFunc() {
                    barClassFuncSpy();
                }
                barString: string = barClassString;
            }
            const modules: IDependencyItem = {
                barFunc: ()=>barFuncSpy,
                BarClass: ()=>MockBar
            }
            restore = mocker.mock('./bar', modules)

        })
        afterEach(() => restore())

        it('Then use mocked bar as dependency', () => {
            const fooClass = new FooClass();
            fooFunc();
            fooClass.fooFunc();
            expect(barFuncSpy).toHaveBeenCalled();
            expect(barClassFuncSpy).toHaveBeenCalled();
            expect(fooClass.fooString).toBe(barClassString);
        })
})
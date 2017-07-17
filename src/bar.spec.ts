
import { KarmaTypescriptMocker, IDependencyItem } from "./karma-typescript-mock";
import { IFooClass } from "./folder/foo";
import { barFunc, BarClass } from "./bar";

describe('bar.ts', () => {

        const mocker = new KarmaTypescriptMocker(), fooClassString = "fooMockClassString";
        var restore, fooFuncSpy, fooClassFuncSpy;
        beforeEach(() => {
            fooFuncSpy = jasmine.createSpy('fooFuncSpy')
            fooClassFuncSpy = jasmine.createSpy('fooClassFuncSpy')
            class Mockfoo implements IFooClass {
                fooFunc() {
                    fooClassFuncSpy();
                }
                fooString: string = fooClassString;
            }
            const modules: IDependencyItem = {
                fooFunc: ()=>fooFuncSpy,
                FooClass: ()=>Mockfoo
            }
            restore = mocker.mock('./folder/foo', modules)

        })
        afterEach(() => restore())

        it('Then use mocked foo as dependency', () => {
            const fooClass = new BarClass();
            barFunc();
            fooClass.barFunc();
            expect(fooFuncSpy).toHaveBeenCalled();
            expect(fooClassFuncSpy).toHaveBeenCalled();
            expect(fooClass.barString).toBe(fooClassString);
        })
})
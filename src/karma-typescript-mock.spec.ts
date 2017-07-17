import { KarmaTypescriptMocker } from "./karma-typescript-mock";

describe('karma-typescript-mock', () => {
    let consoleErrorSpy, _sut;
    const test1MockFunc = () => "test1MockFunc", test1RealFunc = () => "test1RealFunc", validMockImportName = "test1",
        test2MockFunc = () => "test2MockFunc", test2RealFunc = () => "test2realFunc",
        test3MockFunc = () => "test3MockFunc", test3RealFunc = () => "test3realFunc",
        _exportsTest1 = { test: test1RealFunc }, _exportsTest2 = { test: test2RealFunc }, _exportsTest3 = { test: test3RealFunc },
        callMockExport = (name: RegExp | string, mock = test1MockFunc) => _sut.mockExport(name, 'test', () => mock),
        callMock = (name: string | RegExp) => _sut.mock(name, { test: () => test1MockFunc }),
        expectOriginal = () => expect(_exportsTest1.test()).toBe(test1RealFunc()),
        expectMock = () => { expect(consoleErrorSpy).not.toHaveBeenCalled(); expect(_exportsTest1.test()).toBe(test1MockFunc()); }

    beforeEach(() => {
        consoleErrorSpy = jasmine.createSpy('consoleErrorSpy');
        _sut = new KarmaTypescriptMocker({
            "C:/projects/karma-typescript-mock/node_modules/test1/index.js":
            { "exports": _exportsTest1, "id": "node_modules/test1/index.js", "uri": "C:/projects/karma-typescript-mock/node_modules/test1/index.js" },
            "C:/projects/karma-typescript-mock/test2.ts":
            { "exports": _exportsTest2, "id": "test2.ts", "uri": "C:/projects/karma-typescript-mock/test2.ts" },
            "C:/projects/karma-typescript-mock/src/test3.ts":
            { "exports": _exportsTest3, "id": "src/test3.ts", "uri": "C:/projects/karma-typescript-mock/src/test3.ts" },

        }, { error: consoleErrorSpy } as Console);
    });

    describe('WHEN unable to find module', () => {

        it('AND mock THEN error', () => {
            _sut.mock('error', { test: () => test1MockFunc });
            expect(consoleErrorSpy).toHaveBeenCalled();
        })
        it('AND mockExport THEN error', () => {
            _sut.mockExport('error', 'test', () => test1MockFunc);
            expect(consoleErrorSpy).toHaveBeenCalled();
        })
    })


    describe('WHEN unable to find export', () => {
        it('AND mock THEN error', () => {
            _sut.mock(validMockImportName, { error: () => test1MockFunc });
            expect(consoleErrorSpy).toHaveBeenCalled();
        })
        it('aND mockExport THEN error', () => {
            _sut.mockExport(validMockImportName, 'error', () => test1MockFunc);
            expect(consoleErrorSpy).toHaveBeenCalled();
        })
    })

    describe('WHEN Matched import and export', () => {

        it('THEN Mock with exports and restore', () => {
            expectOriginal();
            let restore = callMock(validMockImportName);
            expectMock();
            restore();
            expectOriginal();
        })

        it('THEN Mock with exports and restoreAll', () => {
            callMock(validMockImportName);
            _sut.RestoreAll();
            expectOriginal();
        })

        it('THEN Mock single export and restore', () => {
            let restore = callMockExport(validMockImportName);
            expectMock();
            restore();
            expectOriginal();
        })
    })

    describe('WHEN using regex match', () => {
        it('THEN take the first match', () => {
            let restore = callMockExport(/projects/, test2MockFunc);
            expect(_exportsTest2.test()).toBe(test2MockFunc());
            restore();
            expect(_exportsTest2.test()).toBe(test2RealFunc())
        })
    })

    describe('WHEN file in src', () => {
        const isValid = (name: string) => {
            let restore = callMockExport(name, test3MockFunc);
            expect(consoleErrorSpy).not.toHaveBeenCalled();
            expect(_exportsTest3.test()).toBe(test3MockFunc());
            restore();
            expect(_exportsTest3.test()).toBe(test3RealFunc())
        };

        it('AND using ./ THEN valid', () => isValid('./test3'))
        it('AND using ./*.ts THEN valid', () => isValid('./test3.ts'))
        it('AND using ./src/ THEN valid', () => isValid('./src/test3'))
        it('AND using ./src/*.ts THEN valid', () => isValid('./src/test3.ts'))
        it('AND using src/ THEN valid', () => isValid('src/test3'))
        it('AND using src/*.ts THEN valid', () => isValid('src/test3.ts'))
        it('AND using base path THEN valid', () => isValid('C:/projects/karma-typescript-mock/src/test3.ts'))
    })
})

import { JasmineKarmaTypeScriptMockerSingle } from "./karma-typescript-mock-jasmine";
import { qsModuleParse } from "./nodemodules";


describe("GIVEN nodemodules", () => {

    describe("WHEN qs parse", () => {
        JasmineKarmaTypeScriptMockerSingle("qs", "parse", () => () => "mock");

        it("Then mock correctly", () => {
            expect(qsModuleParse()).toBe("mock");
        })
    })
})
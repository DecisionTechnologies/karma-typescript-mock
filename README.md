# karma-typescript-mock
* Mock imported modules when using [karma-typescript](https://github.com/monounity/karma-typescript/)

## Installation

```
npm install --save-dev karma-typescript-mock
```

# Example
```
    import { KarmaTypescriptMocker } from "karma-typescript-mock";
    var KarmaTypescriptMocker = new KarmaTypescriptMocker();
    let restore = KarmaTypescriptMocker.mock('qs', { parse: ()=>()=>"result"})
    restore();
```

##### Methods
* mock
* mockExport
* restoreAll

##### Notes
* When passing in a function then it must be wrapped in another function e.g. ()=>{ spy = x; return mockFunc}


## Using with Jasmine
```
    import { JasmineKarmaTypeScriptMocker } from "karma-typescript-mock-jasmine";
    describe('Test', ()=>{
        JasmineKarmaTypeScriptMocker('qs', { parse: ()=>()=>"result})
        it('it', ()=>{

        })
    })
```

```
    import { JasmineKarmaTypeScriptMockerSingle } from "karma-typescript-mock-jasmine";
    describe('Test', ()=>{
        JasmineKarmaTypeScriptMocker('qs', parse',  ()=>()=>"result)
        it('it', ()=>{
            
        })
    })
```

## Names you can use as a module to mock
##### Local file
* KarmaTypescriptMocker.mock('**C:/projects/karma-typescript-mock/src/bar.ts**'
* KarmaTypescriptMocker.mock('**src/bar.ts**'
* KarmaTypescriptMocker.mock('**src/bar.ts**'
* KarmaTypescriptMocker.mock('**src/bar**'
* KarmaTypescriptMocker.mock('**./src/bar.ts**'
* KarmaTypescriptMocker.mock('**./src/bar**'
* KarmaTypescriptMocker.mock('**./bar.ts**'
* KarmaTypescriptMocker.mock('**./bar**
##### npm module
* KarmaTypescriptMocker.mock('**query-string**'


## Limitations
* cannot mock exported primitive values like strings
* cannot mock if import is a function e.g. cookies-js
* cannot mock if import is executed immedidately
Set-Location (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)
$buildNo = "$env:BuildNumber"
if([string]::IsNullOrWhiteSpace($buildNo)){ throw "no build number";}

npm install
npm test
npm run build 
npm version $buildNo 
npm publish

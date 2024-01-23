# NPM Audit
<!-- What problem does this solve? -->

## How to install

* Update the HDBT theme
  * `git checkout automation/npm-audit && git pull origin automation/npm-audit`
* In theme folder, run `nvm use && npm i`

## How to test
<!-- Describe steps how to test the features, add as many steps as you want to be tested -->

Run `npm run build && npm audit`

* [ ] Check that the changes for distributed files are sensible
* [ ] Check that the `npm audit` prints `found 0 vulnerabilities`

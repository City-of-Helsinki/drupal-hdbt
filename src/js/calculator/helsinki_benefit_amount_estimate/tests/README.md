# Helsinki benefit calculator tests

## Installation

Needed:

* node installed, tested to be working with at least v18
* optionally, a display and a OS with GUI for headed tests

To install playwright and it's dependencies:

```
npm install
npm run test:install
```

## Running the test suite

Run tests headlessly:

```
npm run test
```

---

Run tests visually:

```
npm run test:ui
```

---

Run tests line-by-line:

```
npm run test:debug
```

---

## To run manual tests on local

* Start a local server on **drupal-hdbt/**, for instance `npx http-server -p 3001`
* Open http://localhost:3001/src/js/calculator/helsinki_benefit_amount_estimate/helsinki-benefit-test.html on your browser.

## To run automatic browser tests
This requires test dependencies to be installed

`cd src/js/calculator/helsinki_benefit_amount_estimate/tests && npm run test`

# js-XOR128

![ci-status](https://github.com/lorossi/js-XOR128/actions/workflows/test.yml/badge.svg)
![coverage](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Florossi.github.io%2Fjs-XOR128%2Fcoverage-badge.json&query=%24.message&label=coverage&color=%24.color)
![version](https://img.shields.io/github/v/release/lorossi/js-XOR128)
![license](https://img.shields.io/github/license/lorossi/js-XOR128)

XOR128 pseudo-random number generator.
Based on the implementation by [WizCorp](https://github.com/Wizcorp/xor128/).

Check the docs here: [lorossi.github.io/js-XOR128/](https://lorossi.github.io/js-XOR128/).

Download [here](https://github.com/lorossi/js-XOR128/releases/latest) the last version.

## Tests

To run the tests:

- clone the repository
- host the `test` folder with a web server
- open the `index.html` file in a browser
- tests will be run automatically via [Mocha](https://mochajs.org/)

There are two categories of tests:

- **unit tests**, to test the single methods and the instantiation of the class
- **randomness tests**, to test the randomness of the generated numbers

The randomness test performed are:

- Chi-square test
- Kolmogorov-Smirnov test
- Bernoulli test

All with a confidence threshold of 0.05.
This does not ensure that the generator is truly random, but it is a good indicator.

## Credits

This project is distributed under MIT license.

The testing framework used is [Mocha](https://mochajs.org/).

The documentation is generated with [JSDoc](http://usejsdoc.org/).

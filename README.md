# HDBT Theme

![CI](https://github.com/City-of-Helsinki/drupal-hdbt/workflows/Lint/badge.svg)

## Introduction

HDBT theme is a base theme for the City of Helsinki. It is based on the core theme stable9. The abbrevation comes from
the words Helsinki Drupal Base Theme. Style follows the [BEM methodology](http://getbem.com/) and javascript is written
as ES6. The JS and SCSS files are compiled and minified with webpack.

## Requirements

This theme requires Drupal core >= 8.8.0.

Requirements for developing:
- [NodeJS ( ^ 12.18 )](https://nodejs.org/en/)
- [NPM](https://npmjs.com/)

## Commands

| Command       | Description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| npm i         | Install dependencies and link local packages.                                     |
| npm ci        | Install a project with a clean slate. Use especially in travis like environments. |
| npm run dev   | Compile styles for development environment. and watch file changes.               |
| npm run build | Build packages for production. Minify CSS/JS.                                     |

Setup the developing environment by running

    nvm use
    npm i
    npx husky i

Explanations for commands.
- `nvm use` : Install and use the correct version of Node.
- `npm i` : As stated above; Install dependencies and link local packages.
- `npx husky i` : Execute husky package binary; Install git-hooks for the project.

## Structure for files and folders

```
hdbt
│   README.md
└───src
│   └───scss
│   │   │   styles.scss
│   └───js
│   │   │   common.js
│   └───icons
│       |   sprite.svg
│       └───subdir
│           |   some-icon.svg
└───dist
    └───css
    └───js
    └───icons
```

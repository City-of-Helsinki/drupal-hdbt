# [UHF-0000](https://helsinkisolutionoffice.atlassian.net/browse/UHF-0000)
<!-- What problem does this solve? -->

## What was done
<!-- Describe what was done -->

* This thing was fixed

## How to install

* Make sure your instance is up and running on latest dev branch.
  * `git pull origin dev`
  * `make fresh`
* Update the HDBT theme
  * `composer require drupal/hdbt:dev-UHF-0000_insert_correct_branch`
* Run `make drush-cr`

## How to test
<!-- Describe steps how to test the features, add as many steps as you want to be tested -->

* [ ] Check that this feature works
* [ ] Check that code follows our standards

## Continuous documentation
<!-- One of the checkboxes below needs to be checked like this: `[x]` (or click when not in edit mode) -->

* [ ] This feature has been documented/the documentation has been updated
* [ ] This change doesn't require updates to the documentation

## Translations
<!-- One of the checkboxes below needs to be checked like this: `[x]` (or click when not in edit mode) -->

* [ ] Translations have been added to .po -files and included in this PR
* [ ] The config files include `langcode: en`

## Other PRs
<!-- For example an related PR in another repository -->

* Link to other PR

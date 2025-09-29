# [UHF-0000](https://helsinkisolutionoffice.atlassian.net/browse/UHF-0000)

## What was done
<!-- Describe what was done, f.e. fixed bug in accordion javascript. -->
* 

## How to install
<!-- Describe steps how to install the features. Default steps are provided. -->
* Make sure your instance is up and running on latest dev-branch
  * `git checkout dev && git pull origin dev`
  * `make fresh`
* Update the HDBT theme
  * `composer require drupal/hdbt:dev-UHF-0000_insert_correct_branch`
* Run code updates
  * `make drush-locale-update drush-cr`

## How to test
<!-- Describe steps how to test the features. Add as many steps as you want to be tested -->
* [ ] 
* [ ] Check that the code follows our standards
* [ ] Check that the differences in visual regression tests are appropriate

<!-- 
Check list for the developer

Privacy  
- Do the changes you made have an impact on privacy? If you are unsure, please check the checklist at: https://helsinkisolutionoffice.atlassian.net/wiki/spaces/HEL/pages/9930473479/Tietosuojan+tarkistuslista+kehitt+jille

Documentation
- Check the documentation exists and is up to date. Add link if the documentation is not included in the PR.

Translations
- Make sure all necessary translations have been added.
-->

## Links to related PRs
<!-- F.e. a related PR in another repository -->
* 

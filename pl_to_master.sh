#!/bin/bash
# git request-pull https://github.com/kogai/hyakkiyako
# git request-pull origin/test git@github.com:kogai/hyakkiyako.git origin/master
# git request-pull test https://github.com/kogai/hyakkiyako/ master

git checkout master
git merge develop

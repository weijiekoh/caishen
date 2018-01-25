#!/bin/sh

cd web
gulp
cd ..
git add -A .
git commit -m "${1}"
git subtree push --prefix web heroku master

#!/bin/bash

# install node mudules (grunt+utils, bower)
npm install
# install bower packages
bower install --force
# run grunt tasks (concat + minify)
grunt

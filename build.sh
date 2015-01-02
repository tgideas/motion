#!/bin/bash
set -ex
BOOTSTRAP=$HOME/dev/workspace/github/ui/bootstrap/
JQ=$HOME/dev/workspace/github/js/jquery/jquery/
DIR0=$PWD


# copy bootstrap
cd $BOOTSTRAP
cp -R dist/* $DIR0/assets/bootstrap

# build & copy jquery
cd $JQ
git pull origin master
#sudo npm install
grunt
cp -R dist/* $DIR0/assets/js


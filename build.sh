#!/usr/bin/env bash

FRONTEND_BRANCH=react-sortable-tree-theme-file-explorer

echo 'update python-courses-show-api project files ...'
git pull
echo 'update dependences ...'
npm i

echo 'process python-courses-show ...'
if [ -d frontend/python-courses-show ]
then
	cd frontend/python-courses-show
  echo 'update python-courses-show project files ...'
	git pull
else
  echo 'clone python-courses-show project files ...'
	git clone https://github.com/ynu-python-course/python-courses-show frontend/python-courses-show
	cd frontend/python-courses-show
fi

echo "switch to ${FRONTEND_BRANCH}"
git checkout ${FRONTEND_BRANCH}
echo 'update dependences ...'
npm i
echo 'building ...'
npm run build

cd ../..

echo 'process 2017-autumn ...'
if [ -d courses/2017-autumn ]
then
	cd courses/2017-autumn
  echo 'update 2017-autumn project files ...'
	git pull
else
  echo 'clone 2017-autumn project files ...'
	git clone https://github.com/ynu-python-course/2017-autumn courses/2017-autumn
	cd courses/2017-autumn
fi

cd ../..

echo 'process docker-compose build ...'
docker-compose build
echo 'process docker-compose up -d ...'
docker-compose up -d

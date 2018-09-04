#!/usr/bin/env bash

git pull

if [ -d python-courses-show ]
then
	cd python-courses-show
	git pull
else
	git clone https://github.com/ynu-python-course/python-courses-show
	cd python-courses-show
fi

npm i
npm run build

cd ..

if [ -d public/courses/2017-autumn ]
then
	cd public/courses/2017-autumn 
	git pull
else
	git clone https://github.com/ynu-python-course/2017-autumn public/courses/2017-autumn 
	cd public/courses/2017-autumn 
fi

cd ../../..

docker-compose build
docker-compose up -d

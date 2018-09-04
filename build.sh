#!/usr/bin/env bash

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

docker-compose build
docker-compose up -d

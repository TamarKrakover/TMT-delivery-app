# Advanced-Programming

build:
docker build -t recommender-image .
run:
docker run -it --rm -v "${PWD}/data:/usr/src/mytest/data" recommender-image
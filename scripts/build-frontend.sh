#!/bin/bash

# Note: if you change this, please be mindful of the .github/workflows/*.yml files.
docker build -t cloudcrafter-frontend --build-arg CLOUDCRAFTER_AXIOS_BACKEND_BASEURL=http://dummy --no-cache -f frontend/apps/web/Dockerfile ./frontend/
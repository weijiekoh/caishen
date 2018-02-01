#!/bin/bash
#gulp
source venv/bin/activate
python3 manage.py collectstatic --no-input
NODE_ENV=development DEV=true python3 manage.py runserver localhost:7000

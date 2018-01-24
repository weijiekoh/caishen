#!/bin/bash
gulp
source venv/bin/activate
python3 manage.py collectstatic --no-input
PROD=true python3 manage.py runserver localhost:7001

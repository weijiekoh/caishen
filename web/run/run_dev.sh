#!/bin/bash
source venv/bin/activate
python3 manage.py collectstatic --no-input
DEV=true python3 manage.py runserver localhost:7000

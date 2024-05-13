SHELL := /bin/bash
.PHONY : all

install:
	cd autism_webapp && pip install -r requirements.txt
	cd frontend && npm ci

run-backend:
	cd autism_webapp && python manage.py runserver
	
run-frontend:
	cd frontend && npm run dev

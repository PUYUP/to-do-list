# Simple To Do list 
A simple project to simulate how django graphql and react works. 
Contain main folder back and front. Back for backend using django and front for frontend using react.

## Requirements 
- python 3.8
- pip
- npm 14
- yarn
- [django](https://docs.djangoproject.com/en/3.2/)
- [nextjs](https://nextjs.org/docs/getting-started)

## Installation
The installation for each folder. This application is tested in Linux environment.

### Back
1. use `pip install -r requirements.txt`
2. run migrations `python manage.py migrate`
3. run it `python manage.py runserver`
4. run test `python manage.py test`

### Front
1. install using `yarn`
2. run it `npm run dev`

### How to use
- To access the application use `localhost:4000` for main application and `localhost:7000/admin` to access django admin page. For now the data is still empty, you can create new data in the front end or by accessing django admin.

- To create a superuser for django admin use `python manage.py createsuperuser` and follow the instruction.

## License
GNU GPL v3

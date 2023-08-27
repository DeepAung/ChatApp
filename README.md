# ChatAppBackend

## Run App Locally

1. duplicate `.env.example` file to new `.env` file
2. host postgresql database `docker-compose up` and config postgres's settings in `.env` file
3. initialize virtual environment (Optional)
4. install modules `pip install -r requirements.txt`
5. migrate database `python manage.py migrate`
6. run server locally `python manage.py runserver`
7. **(Optional)** create super user `python manage.py createsuperuser`
8. run and connect to [**ChatAppFrontend**](https://github.com/DeepAung/ChatAppFrontend)

- api url: [http://localhost:8000/api/](http://localhost:8000/api/)
- admin panel url: [http://localhost:8000/admin/](http://localhost:8000/admin/)

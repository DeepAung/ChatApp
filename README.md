# ChatAppBackend

## Run App Locally

1. rename `.env.example` to `.env`
2. host postgresql database and config postgres's settings in `.env` file
3. install modules `pip install -r requirements.txt`
4. migrate database `python manage.py migrate`
5. run server locally `python manage.py runserver`
6. **(Optional)** create super user `python manage.py createsuperuser`
7. run and connect to [**ChatAppFrontend**](https://github.com/DeepAung/ChatAppFrontend)

- api urls: [http://localhost:8000/api/](http://localhost:8000/api/)
- admin panel: [http://localhost:8000/admin/](http://localhost:8000/admin/)

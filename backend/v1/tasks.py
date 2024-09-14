from celery import Celery
import requests

app = Celery(
    "tasks", broker="redis://localhost:6379/0", backend="redis://localhost:6379/0"
)


@app.task
def my_task(data):
    requests.post("http://localhost:9090", json=data)

    return

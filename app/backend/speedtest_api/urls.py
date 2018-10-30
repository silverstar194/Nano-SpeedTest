from django.urls import path

from speedtest_api import views

urlpatterns = [
    path('/random', views.send_transaction),
]

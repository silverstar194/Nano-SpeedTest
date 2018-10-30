from django.urls import path

from speedtest_api import views

urlpatterns = [
    path('transactions/random', views.send_transaction),
]

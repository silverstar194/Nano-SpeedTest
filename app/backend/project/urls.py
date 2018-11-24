"""nano_speedtest URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from speedtest_api import views

urlpatterns = [
    path('admin/doc/', include('django.contrib.admindocs.urls')),
    path('admin/', admin.site.urls),
    path('transactions/send', views.send_batch_transactions),
    path('transactions', views.generate_transaction),
    path('advertisements/random', views.get_random_advertisement),
    path('advertisements/add', views.add_advertisement),
    path('advertisements/info', views.advertisement_information),
    path('nodes/list', views.list_nodes),
    path('transactions/statistics', views.get_transaction_statistics)
]
from django.contrib import admin

from .models.account import Account
from .models.node import Node
from .models.transaction import Transaction
from .models.wallet import Wallet
from .models.advertisement import Advertisement
from .models.partner import Partner

class AccountAdmin(admin.ModelAdmin):
    pass
admin.site.register(Account, AccountAdmin)

class NodeAdmin(admin.ModelAdmin):
    pass
admin.site.register(Node, NodeAdmin)

class TransactionAdmin(admin.ModelAdmin):
    pass
admin.site.register(Transaction, TransactionAdmin)

class WalletAdmin(admin.ModelAdmin):
    pass
admin.site.register(Wallet, WalletAdmin)

class AdvertisementAdmin(admin.ModelAdmin):
    pass
admin.site.register(Advertisement, AdvertisementAdmin)


class PartnerAdmin(admin.ModelAdmin):
    pass
admin.site.register(Partner, PartnerAdmin)

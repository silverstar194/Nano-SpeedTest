from rest_framework import serializers
from app.backend.speedtest_api.models.models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('ID', 'SenderID', 'ReceiverID', 'StartTime', 'EndTime', 'Amount', 'InitiatorIP')

    def create(self, validated_data):
        """
        Create and return a new `Transaction` instance, given the validated data.
        """
        return Transaction.objects.create(**validated_data)

from rest_framework import serializers

from speedtest_api.models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('origin', 'destination', 'start_timestamp', 'end_timestamp', 'amount', 'initiated_by')

    def create(self, validated_data):
        """
        Create and return a new `Transaction` instance, given the validated data.
        """

        return Transaction.objects.create(**validated_data)

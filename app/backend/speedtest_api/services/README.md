# SpeedTest Backend Services

## Transactions Service

`new_transaction_random(initiated_by)` create (and get) a transaction object that has a randomly assigned origin, destination, and amount.

`new_transaction(origin_account, destination_account, amount, initiated_by)` create a transaction with the given parameters.

`send_transaction(transaction)` send the transaction to the Nano network while timing send and receive.

`get_transaction(id)` get a transaction by id.

`get_transactions()` get all transactions.

## Accounts Service

`new_account(wallet, address=None)` create an account in the database. If no address is specified, create a new account on the node.

`get_account(address)` get an account by address.

`get_accounts()` get all accounts.

`sync_accounts()` synchronize all account balances with the balances provided by the nodes.

## Nodes Service

`new_node(URL, latitude, longitude, location_name=None)` create a new node with the given properties.

`get_node(id)` get a node by id.

`get_nodes()` get all nodes.

## Wallets Service

`new_wallet(node, wallet_id)` create a new wallet in the database. If wallet_id is None, generate the wallet on the node first.

`get_wallet(id)` get a wallet by id.

`get_wallets()` get all wallets.

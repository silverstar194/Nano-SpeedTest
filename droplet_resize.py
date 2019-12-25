import digitalocean
import os
import time
import requests
import logging

logging.basicConfig(filename='droplet_resize.log', format='%(asctime)s - %(message)s', level=logging.INFO)

##constants
UNCHECKED_LIMIT = 1000
UNSYNC_LIMIT = 99.9
instance_large = "s-3vcpu-1gb"
instance_small = "s-1vcpu-2gb"
node_rcp_base = "https://{0}.rcp.nanospeed.live/"
node_location = {"newyork", "frankfurt", "bangalore"}
tag = "node"

##Initialize at start
droplet_manager = digitalocean.Manager(token=os.environ['NANO_ST__DROPLET__API_KEY'])

node_droplets = droplet_manager.get_all_droplets(tag_name=tag)

def get_ninja_blocks():
	ninja_node_count_api = "https://mynano.ninja/api/blockcount"
	r = requests.get(url=ninja_node_count_api) 
	data = r.json()
	return int(data["count"])


def get_node_blocks(node_url):
	r = requests.post(url=node_url, json={"action":"block_count"}) 
	data = r.json()
	return int(data["unchecked"]), int(data["count"])

def generate_droplet_info(droplet):
	for location in node_location:
		if location.lower() in droplet.name.lower():
			return location, node_rcp_base.format(location), droplet

def wait_on_resize(droplet):
	actions = droplet.get_actions()
	for action in actions:
		time.sleep(1)
		action.load()
		actions = droplet.get_actions()
		logging.info("Resize status for {0}: {1}".format(droplet.name, action.status))
		if action.status == "completed":
			return

for droplet in node_droplets:
	location, node_url, droplet = generate_droplet_info(droplet)
	
	ninja_block_count = get_ninja_blocks()
	unchecked, block_count = get_node_blocks(node_url)
	percent_sync = (block_count/ninja_block_count) * 100
	logging.info("Current status for node in {0} \n\t Percent Synced: {1} \n\t Unchecked Blocks: {2}".format(location, percent_sync, unchecked))

	if percent_sync < UNSYNC_LIMIT or unchecked > UNCHECKED_LIMIT and not droplet.size['slug'] != instance_large:
		logging.info("Resizing {0} to {1}".format(location, instance_large))
		droplet.resize(instance_large, disk=True, return_dict=False)
		wait_on_resize(droplet)
		droplet.power_on()
		logging.info("Turning on {0}".format(location))

	if percent_sync > UNSYNC_LIMIT and unchecked < UNCHECKED_LIMIT and droplet.size['slug'] != instance_small:
		logging.info("Resizing {0} to {1}".format(location, instance_small))
		droplet.resize(instance_small, disk=True, return_dict=False)
		wait_on_resize(droplet)
		droplet.power_on()
		logging.info("Turning on {0}".format(location))


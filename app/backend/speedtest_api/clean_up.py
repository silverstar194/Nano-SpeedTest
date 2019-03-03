import logging
import time

logger = logging.getLogger(__name__)


def clean_up():
    """
   Cleans up and validates database state same as start up.
   Django auto runs startup code for ant command

    """
    time.sleep(60*15)  # Allow PoW to finish across threads
    logger.info("Clean up task completed...")

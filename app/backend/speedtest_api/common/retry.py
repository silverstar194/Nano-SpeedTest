import time


def retry(func, retries=3, pause=.1):
    for i in range(retries):
        try:
            return func()
        except:
            if i < retries - 1: # i is zero indexed
                time.sleep(pause)
                continue
            else:
                raise

import secrets
import time

time.sleep(5) #delay to generate the token

secret = secrets.token_hex(32)
print(secret)
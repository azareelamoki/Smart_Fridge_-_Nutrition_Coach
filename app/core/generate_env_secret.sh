#!/bin/bash

# storing the secret key in .env file
echo "SECRET_KEY=$(python3 generate_token.py)" >> .env

echo "Secret key generated and added to .env"
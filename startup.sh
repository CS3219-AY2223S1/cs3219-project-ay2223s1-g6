#!/bin/sh

# Copy .env file to each services
cp ./.env ./user-service/.env
cp ./.env ./matching-service/.env
cp ./.env ./question-service/.env
cp ./.env ./editor-service/.env
cp ./.env ./chat-service/.env
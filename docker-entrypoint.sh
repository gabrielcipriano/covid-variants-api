#!/bin/bash

npx typeorm migration:run

# node dist/src/main

exec "$@"
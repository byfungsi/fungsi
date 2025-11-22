#!/bin/bash
set -e

# Create databases for each microservice
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create auth service database
    CREATE DATABASE mservice_auth;
    GRANT ALL PRIVILEGES ON DATABASE mservice_auth TO postgres;

    -- Add more service databases here as needed
    -- CREATE DATABASE mservice_payments;
    -- GRANT ALL PRIVILEGES ON DATABASE mservice_payments TO postgres;

    -- CREATE DATABASE mservice_orders;
    -- GRANT ALL PRIVILEGES ON DATABASE mservice_orders TO postgres;
EOSQL

echo "Databases created successfully!"

-- Create databases for each microservice (idempotent - safe to run multiple times)

-- Auth service database
SELECT 'CREATE DATABASE mservice_auth'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mservice_auth')\gexec

-- Add more service databases here as needed (uncomment when ready)
-- SELECT 'CREATE DATABASE mservice_payments'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mservice_payments')\gexec

-- SELECT 'CREATE DATABASE mservice_orders'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mservice_orders')\gexec

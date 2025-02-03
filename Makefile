PROJECT_NAME=applications-assistant
DB_NAME=job-assistant

dev:
	npm run dev

build:
	npm run pages:build

update-db:
	npx wrangler d1 migrations apply $(DB_NAME) --local

deploy:
	npx wrangler d1 migrations apply $(DB_NAME) --remote
	npm run deploy

logs:
	npx wrangler pages deployment tail --project-name $(PROJECT_NAME)
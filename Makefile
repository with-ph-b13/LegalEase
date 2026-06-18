.PHONY: dev

dev:
	@echo "Starting backend..."
	cd backend && pnpm dev &
	@echo "Starting frontend..."
	pnpm dev &
	wait

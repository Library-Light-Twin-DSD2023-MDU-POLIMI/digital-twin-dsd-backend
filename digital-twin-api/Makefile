build-DigitalTwinAPI:
	#npm install
	#npm run compile
	mkdir -p "$(ARTIFACTS_DIR)/nodejs/node_modules"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/" # for runtime deps
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/" # for runtime deps
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # for runtime deps
	#cp -r commons "$(ARTIFACTS_DIR)/nodejs/node_modules" 
	esbuild app.ts --minify --target=es2020 --sourcemap --outdir="$(ARTIFACTS_DIR)/nodejs"
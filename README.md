# Library Light Twin

## Set up development enviroment
See [SETUP.md](SETUP.md)

## List of commands for development

*The commands underneath here are bash commands*

Just if you already have the tooling installed, basic commands you can use to check stuff

- Build the project, and run it locally:
```bash
sam build
sam validate # optional to check template.json is correct, you can skip this one
sam local start-api
```

- Deploy the project to the cloud (**this should be done through github actions or similar, when pushing to main, see [PR#7](https://github.com/Library-Light-Twin-DSD2023-MDU-POLIMI/digital-twin-dsd-backend/pull/7)**):
```bash
sam deploy # and then confirm changes to the cloud
```

- Run automated tests on the project (**this should also be done, either when pushing to development, or main, implemented in [PR#?]()**)
```bash
# TODO missing commands for this
```

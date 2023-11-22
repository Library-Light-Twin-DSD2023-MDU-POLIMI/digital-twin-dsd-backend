# Library Light Twin

## Set up development enviroment
See [SETUP.md](SETUP.md)

## List of commands for development

- Build the project, and start a local api (any errors will be printed in the terminal).
```bash
sam build
sam local start-api
```

- By default, the **digital-twin-api** development branch will be
  imported. If you need to test a change you made in a pr in that repo,
  by just using it here, you can do so with these commands. _please remember to check the git-link mentioned here in package.json before you uninstall the package_
```bash
npm uninstall digital-twin-api
npm install <git-link-found-in-package.json-without-the-old-branch>#the-test-branch
```

**It is important to remember that, we should change the branch used here, for the main branch, always before doing a merge to main (so that the main branch here doesnt get the development version of digital-twin-api)** 

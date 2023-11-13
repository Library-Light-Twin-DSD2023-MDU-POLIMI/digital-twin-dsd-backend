# Setup instruction for working on the backend

This guide is intended to make the setup easier if you are using vscode. If you are using anything else as an IDE, there are probably plugins you can search for working with aws, and they probably will be similar

1. [Install `nodejs`](): Must be version 18.X (version configured for SAM)

1. [Install `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

2. [Install `esbuild`](https://esbuild.github.io/getting-started/#install-esbuild): This is used by AWS SAM in order to transpile typescript to javascript code. `esbuild` doesn't check types, so in order to check everything is okay, we need to use `tsc`

3. [Install `aws` CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

4. [Install `sam` CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

5. [Install `tsc`](https://www.typescriptlang.org/id/download)

6. If you don't have it already (and unless you want to use anything else) get vscode and install the recomended extensions (search `@recommended` and look at the Workspace extensions). If you are using another IDE, just search for whatever extensions you feel would be appropriate.

7. You should install `docker` if you want to test the backend locally

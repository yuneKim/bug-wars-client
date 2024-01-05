# Welcome to the Bug Wars Client contributing guide

## Table Of Contents

[Set up a local dev environment](#set-up-a-local-dev-environment)

[How to contribute](#how-to-contribute)

## New Contributor Guide

In order to run the project on your computer, you need to do the following:

Clone the repo onto your machine

```
git clone https://github.com/yuneKim/bug-wars-client.git
```

Create the file `bug-wars-client/.env` with the following contents. This will set the base url for axios.

```
VITE_REMOTE_API=http://localhost:8080
```

Install the project dependencies

```
npm install
```

You can now run the client

```
npm run dev
```

Check the `package.json` for more useful commands.

Assuming you are using [VS Code](https://code.visualstudio.com/), you'll want to install the following extensions:

- [Vue Language Features (Volar)](vscode:extension/Vue.volar)
- [TypeScript Vue Plugin (Volar)](vscode:extension/Vue.vscode-typescript-vue-plugin)
- [ESLint](vscode:extension/dbaeumer.vscode-eslint)
- [Prettier](vscode:extension/esbenp.prettier-vscode) (I recommend setting this to [run on save](https://stackoverflow.com/a/75582834))

## How to contribute

To create a new feature / bug fix / whatever, create a new branch:

```
git checkout -b <your-branch>
```

If you are going to implement a feature or fix a bug, your branch name should be formatted like

```
feature--login-page
bug--user-controller-response-status
```

As you are working on your feature, continue to pull from main periodically to make sure your work doesn't conflict with anyone else's.

```
git pull origin main
```

You should regularly push your changes to your branch. Try and keep the cope of your commits small so if you need to go back to a previous commit it's easier to do.

```
git add -A
git commit -m "styled login page"
git push origin <your-branch>
```

Before opening a pull request (PR), make sure all tests pass and have acceptable coverage.

```
npm run test:unit:coverage     # runs all vitest tests and generates a coverage report
npm run test:e2e               # runs cypress e2e tests
```

You can also run vitest in watch mode. This is handy for when you're writing new tests. When you save, vitest will rerun any tests associated with that file.

```
npm run test:unit
```

Similarly, you can run cypress in dev mode. This is helpful when writing tests

```
npm run test:e2e:dev
```

When you're satisfied with your work and ready to merge your changes to main, head to github and [create a PR](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request?tool=webui). Automated tests will run on your code. If they fail, you'll need to adjust your code until they pass. If there is a merge conflict, you'll need to resolve it before your branch can be merged. Finally, a group member will review your code. If they spot something funky, they may ask you to make a few changes. Once your PR is approved, your changes can be merged onto main. Thanks for your contribution!

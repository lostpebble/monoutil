# `glcl`

> A simple utility to remove files and directories in a project directory based on a list of globs defined in a file.

## Pre-requisites

- [Bun](https://bun.sh/)

## Usage

### Create a glob list file

At the root of your project, create a file named `glob-list.clean` and add the globs you want to use.

For example:

```txt
./node_modules
./packages/*/node_modules
./packages/*/dist*
./packages/*/_output
```

Then, using `bunx` run the following command:

```sh
bunx glcl
```

This will remove all files and directories that match the globs in the `glob-list.clean` file.

### Customized glob file lists

You don't have to only use the default `glob-list.clean` file.

You can also use a custom glob file list by passing the file names as arguments:

```sh
bunx glcl -f glob-list.custom -f some-other-glob-list
```

This allows you to have multiple glob lists for different purposes.
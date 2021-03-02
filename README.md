# Search Widgets

A lightweight search integration for using Sajari as simple embedded widgets. It is a wrapper of our [React SDK](https://react.docs.sajari.com/).

## Example

Coming soon

## The stack

- [Preact](https://preactjs.com/)
- [Preact CLI](https://preactjs.com/cli/)
- [Tailwind](https://tailwindcss.com/)
- [Twin.Macro](https://github.com/ben-rogerson/twin.macro/)
- [Styled Components](https://styled-components.com/)

## Getting started

- Run `yarn` to install the dependencies
- Run `yarn start` to start the development build and serve the preview
- Open [http://localhost:8080]()
- Edit the props on the left to see the changes on the preview on the right

## Integrating

Create the following HTML and add your props object from the preview:

```html
<div data-widget="search-ui">
  <script type="application/json">
    {YOUR PROPS OBJECT}
  </script>
</div>
```

## Deploying

Deployment is handed via Atlassian changesets. To create a new release, your change/PR must have an associated changeset. To create one, run `yarn changeset`.

You should never need to manually deploy, but if you do:

- `yarn deploy` will create a production build, using the version from the package.json and deploy to GCS (cdn.sajari.com/embed).
- `yarn deploy:loader-only` will update the major-version loader.js (e.g. `/1/loader.js`) to point to the version in package.json.
- `yarn deploy:full` will do a full deployment of all files and point the major version loader to the current version in package.json. Essentially, it's a shortcut for `yarn deploy && yarn deploy:loader-only`.

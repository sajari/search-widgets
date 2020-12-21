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

- Update the version in package.json
- Run `yarn deploy` to create a production build and deploy to AWS S3
- If the version is safe to be latest, run `yarn deploy:latest` to point the loader to that version

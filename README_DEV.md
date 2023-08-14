# Developer README

This documentation is to assist developers of Prez UI, not users or installers.

## `/object` endpoint behaviour

The object page has the following behaviour:

- If a URI has been supplied:
    - If the resource does not exist in the data, display a not found error message
    - If the resource exists but does not have a `prez:link`, display a message saying the resource contains no links within Prez
    - If the resource has one `prez:link`, automatically redirect to that page within Prez UI
    - If the resource has multiple links, list them to select from on the object page
- If no URI has been supplied, show base object page, containing info on how to use this page

## Recommended Resources

[Visual Studio Code](https://code.visualstudio.com/) is the recommended IDE for development on Prez UI because of its intellisense with TypeScript. These extensions are highly recomended:

- [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - Make sure to enable [takeover mode](https://vuejs.org/guide/typescript/overview.html#volar-takeover-mode)

Nice-to-haves:

- [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)

# Prez UI
This is a refactor of Prez UI in Nuxt 3, using the `prez-lib` & `prez-components` libraries.

This application is designed to be extended for themed instances through the use of Nuxt layers. The pages and routing and are contained in this project. 

Relevant components are re-exported in `components/` from `prez-components` to be exposed to Nuxt in the layer to be extended.

## Extending Prez UI

See the /examples folder for examples on how to use Prez UI, different ways to customise it and integrate with Prez.

## Environment settings
The runtime prez API endpoint can be set using this environment variable. Changing this env
setting does not require a rebuild.

```
File: .env

NUXT_PUBLIC_PREZ_API_ENDPOINT="https://api.prez-services"

```
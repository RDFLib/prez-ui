# Prez UI
Prez UI is the front end of [Prez](https://github.com/RDFLib/prez) - a linked data API.

Prez UI is a [Vue.js](https://vuejs.org/) single page application (SPA) that uses [N3.js](https://github.com/rdfjs/N3.js) to process RDF data from the Prez API.

## Environment Variables
Configuring an instance of Prez UI is done by supplying environment variables.

[Vite](https://vitejs.dev) automatically imports environment variables from `.env*` files with a preference order (see [Vite Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html#env-files)), where `.env.[mode].local` will be preferenced over `.env.[mode]` files for example, where `[mode]` would be `development`, `production`, etc. For convenience for local development, it is recommended to create a `.env.development.local` file to set your local environment variables.

See [.env.development](./.env.development) for the default values for the available environment variables. Note that environment variables must be prefixed with `VITE_`.

## Docker
Prez UI can be deployed as a Docker container, which contains an NGINX server serving static files. Soon theming and configuring the NGINX server will be implemented using volumes.

### SSL
To enable SSL for a Docker container deployment, supply your own `nginx.conf` file containing the commented-out lines for SSL in the supplied [nginx.conf](./nginx.conf) file in a Docker volume (yet to be implemented).
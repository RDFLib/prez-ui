export default defineAppConfig({
  menu: [
    { "label": "Home", "url": "/" },
    { "label": "Catalogs", "url": "/catalogs" },
    { "label": "Search", "url": "/search"},
    { "label": "About", "url": "/about" }
  ],
  nameSubstitutions: {
    'catalogs': 'Catalogs',
    'items': 'Items',
    'collections': 'Collections'
  },
  breadcrumbPrepend: [
    { label: 'Home', url: '/' }
  ],
  utilsMenu: [
    { label: 'ui', url: '/_prez/ui' },
    { label: 'lib', url: '/_prez/lib' },
    { label: 'cfg', url: '/_prez/cfg' },
    { label: 'tailwind', url: '/_tailwind/'}
  ]
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
  }
}

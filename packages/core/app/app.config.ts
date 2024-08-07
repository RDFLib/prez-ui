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
    { label: 'lib', url: '/_utils/lib' }
  ]
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
  }
}

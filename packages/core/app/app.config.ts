export default defineAppConfig({

  menu: [
    { "label": "Home", "url": "/" },
    { "label": "Catalogs", "url": "/catalogs" },
    { "label": "Search", "url": "/search"},
    { "label": "Profiles", "url": "/profiles" },
    { "label": "About", "url": "/about" }
  ],

  nameSubstitutions: {
    'catalogs': 'Catalogs',
    'items': 'Items',
    'profiles': 'Profiles',
    'collections': 'Collections'
  } as Record<string, string>,

  breadcrumbPrepend: [
    { label: 'Home', url: '/' }
  ],

  utilsMenu: [
    { label: 'home', url: '/' },
    { label: 'ui', url: '/_prez/ui' },
    { label: 'lib', url: '/_prez/lib' },
    { label: 'cfg', url: '/_prez/cfg' },
    { label: 'tailwind', url: '/_tailwind/'}
  ],

  pagination: {
    itemsPerPage: 10
  }

})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    menu?: Array<{label: string, url: string}>,
    nameSubstitutions?: Record<string, string>,
    breadcrumbPrepend?: Array<{label: string, url: string}>,
    utilsMenu?: Array<{label: string, url: string}>
  }
}

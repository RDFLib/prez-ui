export default defineAppConfig({
  menu: [
    { "label": "XHome", "icon": "pi pi-home", "url": "/" },
    { "label": "Catalogs", "icon": "pi pi-star", "url": "/catalogs" },
    { "label": "Search", "icon": "pi pi-search", "url": "/search",
      "items": [
        { "label": "Catalogs" },
        { "label": "Spatial" },
        { "separator": true },
        { "label": "Everything" }
      ]
    },
    { "label": "About", "icon": "pi pi-envelope", "url": "/about" }
  ]
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /** Menu configuration for the PrezPageMenu */
    menu: object
  }
}

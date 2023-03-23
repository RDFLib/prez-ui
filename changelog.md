## Changes for 2023-03-23

This update provides basic UI map search functionality to the SpacePrez subsystem.

Map search features:
- Ability to select a point, rectangle or polygon on a google map
- Select an area type to search - nearby, contains, overlaps, within
- Selection of one or more feature collections within the available datasets
- Limiting of the number of results
- Show query - displays the generated SPARQL query to get map search results

To be done:
- Allow bounding box to be provided through a link
- Move to newer google map api implementation
- Extend map component to allow for initial shape information


Files updated:
- /src/components/SearchMap.vue (+.d) - Main <SearchMap> component to add a google map with draw controls
- /src/components/SpacePrezSearch.vue - Search page for SpacePrez, uses the SearchMap component and calls stores to retrieve/query map data
- /src/stores/datasetsStore.ts (+.d) - Executes a predefined SPARQL query to retrieve dataset and feature information, uses n3 to parse the RDF response
- /src/stores/mapSearchStore.ts (+.d) - Executes a generated SPARQL query based on search form criteria and location geometry from the SearchMap component
- /src/util/mapSearchHelper.ts - Contains helper functions for generating the map SPARQL query, and other UI helpers for the search map
- /src/config.json - Updated to include default map settings for the google map, can be overwritten when including the SearchMap component
- /src/types.ts - Added type definitions for the map settings config. Note, other definitions live along side the components in .d.ts files
- /src/terraformer.d.ts - For the terraformer module
- /vite.config.ts - update optimizeDeps to include @fawmi/vue-google-maps 

Updated modules:
- @terraformer/arcgis - to create geoJSON from WKT
  @terraformer/wkt
- @fawmi/vue-google-maps - vue google map component, verification of newer google map api required




## Change for 2023-05-03
Add map client to search and item pages
- SearchView updates to add map for any results with spatial data
- PropTableView includes a map for any pages with spatial data
- Temp fix for loading icon issue
- Minor change to reduce white space for search forms

## Change for 2023-04-27

Updates to SpacePrez search
- Area type defaults to Nearby for points and Contains for areas
- Search button bug fixed
- Search loading feedback
- Updates to SPAQRL query to remove filters
- Duplicate search request issue

## Changes for 2023-03-24

Merge of map search changes for SpacePrez

Configuration management:
- Addition of new environment variables VITE_MAPSETTINGS_...
- Creation of new map config key to allow other components to use the default map settings through the config key
- Update components dependent on map config, add helper function to retain config types when injecting
- Update SPARQL queries to use configuration to specify classnames and other properties

Update SearchPrezHomeView to include the new SpacePrezSearchMap
Update datasetStore and spacePrez map search to use config settings

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
- /src/main.ts - Include app use for map component 
- /src/terraformer.d.ts - For the terraformer module
- /vite.config.ts - update optimizeDeps to include @fawmi/vue-google-maps

Updated modules:
- @terraformer/arcgis - to create geoJSON from WKT
  @terraformer/wkt
- @fawmi/vue-google-maps - vue google map component, verification of newer google map api required




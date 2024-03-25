export const itemProperties = [
    {
        predicate: {label: 'IRI', 'link': 'https://prez.dev.kurrawong.ai/profiles/iri'},
        object: {value: 'http://www.w3.org/ns/dx/conneg/altr-ext#alt-profile'},
    },
    {
        predicate: {label: 'Label', link: 'http://www.w3.org/2000/01/rdf-schema#label', tooltip: 'rdfs:label'},
        object: {value: 'Top level catalog', dataType: 'http://www.w3.org/2001/XMLSchema#string'},
    },
    {
        predicate: {label: 'Has Part', link: 'http://purl.org/dc/terms/hasPart', tooltip: 'pcterms:hasPart'},
        object: {value: 'Lower level catalog'}
    },
    {
        predicate: {label: 'Members', link: 'https://prez.dev/members', tooltip: 'prez:members'},
        object: {widget: 'button', label: 'View Members'}
    }
]

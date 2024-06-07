import { PrezProperties, PrezProperty, PrezTerm } from "prez-lib";

const fields = [
    'http://purl.org/dc/terms/title',
    'http://purl.org/dc/terms/isPartOf',
    'http://purl.org/dc/terms/identifier',
//    'http://www.w3.org/ns/dcat#Resource',
    'http://www.opengis.net/def/metamodel/ogc-na/doctype',
    'http://purl.org/dc/terms/creator',
    'http://purl.org/dc/terms/created',
] as const;

export type ItemFields = typeof fields[number];

export type ItemProperties = Partial<Record<ItemFields, PrezProperty>>;
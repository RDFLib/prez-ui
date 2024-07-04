import { type PrezTerm, type PrezLiteral, type PrezNode, type PrezLink, literal, node, PrezItem, PrezProperties, bnode, PrezBlankNode } from "prez-lib";

import { JsonLdDocument, NodeObject, ValueObject, ContextDefinition, expand, frame } from 'jsonld';

const IRI_SHACL_FOCUS_NODE = "http://www.w3.org/ns/shacl#focusNode";

function isFocusNode(n: NodeObject | ValueObject) {
    return ("@type" in n && n["@type"] == IRI_SHACL_FOCUS_NODE && "@id" in n);
}

type JSONTerm = {
    '@id'?: string;
    '@type'?: string;
    '@value'?: string;
    [predicate:string]: any;
} | string

function JSONtoTerm(doc:JSONTerm) {
    if(typeof(doc) == 'string') {
        return literal(doc);
    } else {
        if('@id' in doc) {
            if(doc['@id']![0] == '_') {
                return bnode(doc['@id']!);
            } else {
                const n = node(doc['@id']!);
                setNodePropertiesFromJSON(n, doc);
                return n;
            }
        } else if('@value' in doc) {
            return literal(doc['@value']!);
        } else {
            throw new Error('Unable to convert JSON to terms')
        }
    }
}

enum PrezPredicates {
    Label = 'https://prez.dev/label',
    Description = 'https://prez.dev/description',
    Provenance = 'https://prez.dev/provenance',
    Link = 'https://prez.dev/link'
}

function setNodePropertiesFromJSON(n: PrezNode, doc:JSONTerm) {
    if(typeof(doc) == 'object') {
        if(PrezPredicates.Label in doc) {
            n.label = literal(doc[PrezPredicates.Label]);
        }
        if(PrezPredicates.Description in doc) {
            n.description = literal(doc[PrezPredicates.Description]);
        }
        if(PrezPredicates.Provenance in doc) {
            n.provenance = literal(doc[PrezPredicates.Provenance]);
        }
        if(PrezPredicates.Link in doc) {
            n.links = n.links || []
            n.links.push({value: doc[PrezPredicates.Link], parents: [n]});
        }
    }
}

function setProperty(prezNode: PrezNode, properties: PrezProperties, predicate: string, predNode: PrezNode, term: PrezTerm) {
    switch(predicate) {
        case 'https://prez.dev/label':
            prezNode.label = term as PrezLiteral;
            break;
        case 'https://prez.dev/description':
            prezNode.description = term as PrezLiteral;
            break;
        case 'https://prez.dev/provenance':
            prezNode.provenance = term as PrezLiteral;
            break;
        case 'https://prez.dev/link':
            prezNode.links = [{value: term.value, parents: [prezNode]}];
            break;
        default:
            if(predicate in properties) {
                properties[predicate].objects.push(term);
            } else {
                properties[predicate] = {predicate: predNode, objects: [term]}
            }
    }
}

function setAllPropertiesFromJSON(prezNode: PrezNode, properties: PrezProperties, n: NodeObject, lookupId: Record<string, NodeObject>) {
    // loop through each JSON property
    for(const prop of Object.keys(n)) {
        // this property is an object
        if(typeof(n[prop]) == 'object') {
            // type to NodeObject
            let propObject:NodeObject = ((n as NodeObject)[prop]) as NodeObject;

            // if we have a @datatype, lookup the type in the other root nodes
            if('@type' in propObject && lookupId[propObject['@type'] as string]) {
                console.log(propObject, lookupId[propObject['@type'] as string])
                propObject = {...propObject, ...lookupId[propObject['@type'] as string]};

            // if we have an @id, lookup the id in the other root nodes
            } else if('@id' in propObject && lookupId[propObject['@id'] as string]) {
                propObject = {...propObject, ...lookupId[propObject['@id'] as string]};
            }

            // if we're currently looking at a non-system predicate
            if(prop[0] != '@') {

                if('@id' in propObject && (propObject['@id'] as string)[0] == '_') {

                    const bterm = JSONtoTerm(propObject as JSONTerm);
                    const predNode = node(prop);
                    if(prop in lookupId) {
                        setNodePropertiesFromJSON(predNode, lookupId[prop] as JSONTerm);
                    }

                    setProperty(prezNode, properties, prop, predNode, bterm);
                    setAllPropertiesFromJSON(predNode, (bterm as PrezBlankNode).properties, propObject, lookupId)

                } else {

                    // translate the object to a term
                    const term = JSONtoTerm(propObject as JSONTerm);

                    console.log(prop, propObject, term);
                    const predNode = node(prop);
                    
                    // this predicate has a lookup with the same id as the pred iri
                    // apply it to prednode
                    if(prop in lookupId) {
                        setNodePropertiesFromJSON(predNode, lookupId[prop] as JSONTerm);
                    }
                    
                    // this predicate has a datatype defined,
                    // so if a lookup object is found, apply it to the prednode
                    if('@type' in propObject) {
                        setNodePropertiesFromJSON(predNode, propObject as JSONTerm);
                    }
                    
                    setProperty(prezNode, properties, prop, predNode, term);
                    // const pred = node(prop);
                    // prezItem.properties[prop] = {predicate: pred, objects: [JSONtoTerm(propObject as JSONTerm)]}
                }
            }
        }
    }
    setNodePropertiesFromJSON(prezNode, n as JSONTerm);
}

export async function loadJSON(doc: JsonLdDocument) {
    console.log("LOAD", doc)

    const doc2 = await frame(doc, {});

    const prezItem:PrezItem = {
        focusNode: node(''),
        properties: {}        
    }
    let focusNode:PrezNode = node('');
    console.log("DOC2", doc2)
    if("@graph" in doc2) {
        const graph = doc2["@graph"];
        if(Array.isArray(graph)) {

            // create a lookup with the non-focus nodes properties
            const lookupId:Record<string, NodeObject> = {};
            for(const n of graph.filter(n=>!isFocusNode(n))) {
                if('@id' in n) {
                    const { "@id": _, ...nodeWithoutId } = n;                    
                    lookupId[n['@id'] as string] = nodeWithoutId;
                }
            }

            // process the focus node
            for(const n of graph.filter(n=>isFocusNode(n))) {
                prezItem.focusNode = node({value: (n as NodeObject)["@id"] as string});
                setAllPropertiesFromJSON(prezItem.focusNode, prezItem.properties, n, lookupId);
            }
        } 
        console.log(prezItem)
    }
    return prezItem;
}

/*
// Define the transformed structure
interface StandardizedDocument {
    "@context": ContextDefinition;
    "@id": string;
    "@type": string;
    [predicate: string]: any; // Dynamic predicate handling
}

// Function to convert ContextDefinition to NodeObject[]
function contextDefinitionToNodes(context: ContextDefinition): NodeObject[] {
    return Object.keys(context).map(key => ({
      "@id": key,
      "@type": "@vocab",
      "@vocab": context[key]
    }));
}

// Function to expand JSON-LD context
async function expandContext(context: ContextDefinition): Promise<{ [key: string]: string }> {
    const contextNodes = contextDefinitionToNodes(context);
    const expandedContext = await expand(contextNodes);
     // Handle the case where expandedContext may contain an array of nodes
    const contextMap: { [key: string]: any } = {};
    expandedContext.forEach(entry => {
        if (entry["@id"]) {
            const ids = Array.isArray(entry["@id"]) ? entry["@id"] : [entry["@id"]];
            ids.forEach(id => {
                contextMap[id] = entry;
            });
        }
    });
    return contextMap;
}




function expandCurie(context:ContextDefinition, iri:string) {
    if(iri) {
        const parts = iri.split(':', 2);
        return (Object.keys(context).filter(prefix=>parts[0] == prefix).map(p=>context[p]) || parts[0]) + parts?.[1];
    } else {
        return iri;
    }
}

function toValueCurie(context: ContextDefinition, iri:string): {value: string, curie?: string} {
    const expanded = expandCurie(context, iri);
    if(expanded != iri) {
        return {value: expanded, curie: iri};
    } else {
        return {value: iri};
    }
}



function JSONToTerm(context:ContextObject, o:Term) {
    if(typeof(o) == 'string') {
        return literal(o);
    } else {
        if(o["@value"]) {
            const lit = toValueCurie(context, o["@value"]) as PrezLiteral;
            if(o['@type']) {
                lit.datatype = node(toValueCurie(context, o['@type']));
                if(o['@value']) {
                    lit.value = o['@value'];
                }
            }
            return lit;
        } else if(o['@id']) {

        }

        if(curie found) {
            ...
        }
    }
}


function transform(input:) {

}*/
// ---------------------------------------
// this library will move to prez-lib...
// ---------------------------------------

import { type PrezTerm, type PrezLiteral, type PrezNode, literal, node, PrezItem, PrezProperties, bnode, PrezBlankNode } from "prez-lib";
import { JsonLdDocument, NodeObject, ValueObject, frame } from 'jsonld';

type JSONTermItem = {
    '@id'?: string;
    '@type'?: string;
    '@value'?: string;
    '@language'?: string;
    [predicate:string]: any;
} | string;

type JSONTerm = JSONTermItem | JSONTermItem[];


enum PrezPredicates {
    Label = 'https://prez.dev/label',
    Description = 'https://prez.dev/description',
    Provenance = 'https://prez.dev/provenance',
    Link = 'https://prez.dev/link',
    FocusNode = 'https://prez.dev/FocusNode'
}

function isFocusNode(n: NodeObject | ValueObject) {
    return ("@type" in n && n["@type"] == PrezPredicates.FocusNode && "@id" in n);
}

/**
 * Take a JSON object and turn it into a PrezTerm
 * 
 * @param doc The JSONTerm to proces
 * @returns A PrezLiteral, PrezNode or PrezBlankNode
 */
function JSONtoTerm(docObjOrArray:JSONTerm):PrezTerm[] {
    const terms:PrezTerm[] = [];
    for(const doc of Array.isArray(docObjOrArray) ? docObjOrArray : [docObjOrArray]) {
        if(typeof(doc) == 'string') {
            terms.push(literal(doc));
        } else if('@id' in doc) {
            if(doc['@id']![0] == '_') {
                terms.push(bnode(doc['@id']!));
            } else {
                const n = node(doc['@id']!);
                setNodePropertiesFromJSON(n, doc);
                terms.push(n);
            }
        } else if('@value' in doc) {
            terms.push(literal({value: doc['@value']!, 
                datatype: '@type' in doc ? node(doc['@type']!) : undefined,
                language: '@language' in doc ? doc['@language'] : undefined
            }));
        } else {
            throw new Error('Unable to convert JSON to terms')
        }
    }
    return terms
}

/**
 * Given a PrezNode and a JSON object, set the system label, description, provenance,
 * on the provided node based on the prez predicates found in the JSON object
 * 
 * @param n - the PrezNode to evaluate
 * @param doc - the JSONTerm to get the properties from
 */
function setNodePropertiesFromJSON(n: PrezNode, doc:JSONTerm) {
    if(typeof(doc) == 'object') {
        if(PrezPredicates.Label in doc) {
            console.log('setting label', doc[PrezPredicates.Label])
            n.label = JSONtoTerm(doc[PrezPredicates.Label])[0] as PrezLiteral;
        }
        if(PrezPredicates.Description in doc) {
            n.description = JSONtoTerm(doc[PrezPredicates.Description])[0] as PrezLiteral;
        }
        if(PrezPredicates.Provenance in doc) {
            n.provenance = JSONtoTerm(doc[PrezPredicates.Provenance])[0] as PrezLiteral;
        }
        if(PrezPredicates.Link in doc) {
            n.links = n.links || []
            n.links.push({value: doc[PrezPredicates.Link], parents: [n]});
        }
    }
}

/**
 * Given a predicate and term, set the value on a list of properties
 * 
 * @param prezNode - the node to add any system properties to, e.g. prez properties
 * @param properties - list of properties to add this predicate/term to
 * @param predicate - the name of the predicate
 * @param predNode - the node representing the predicate
 * @param term - the term object value relating to this predicate
 */
function setProperty(prezNode: PrezNode, properties: PrezProperties, predicate: string, predNode: PrezNode, term: PrezTerm) {
    switch(predicate) {
        case PrezPredicates.Label:
            prezNode.label = term as PrezLiteral;
            break;
        case PrezPredicates.Description:
            prezNode.description = term as PrezLiteral;
            break;
        case PrezPredicates.Provenance:
            prezNode.provenance = term as PrezLiteral;
            break;
        case PrezPredicates.Link:
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

/**
 * Set all properties found from a JSON object, includes expanding from root lookup definitions
 * 
 * @param prezNode 
 * @param properties 
 * @param n 
 * @param lookupId 
 */
function setAllPropertiesFromJSON(prezNode: PrezNode, properties: PrezProperties, n: NodeObject, lookupId: Record<string, NodeObject>) {

    // loop through each JSON property
    for(const propName of Object.keys(n)) {

        const prop = n[propName];

        // Check if the property is an object or array
        if (prop && typeof prop === 'object' && prop !== null) {
            const nItems = Array.isArray(prop) ? prop : [prop];        

            for(const nItem of nItems) {
                // this property doesn't have a value that is an object
                if(typeof(nItem) != 'object') continue;

                // type to NodeObject
                let propObject:NodeObject = nItem as NodeObject;

                // if we have an @id, lookup the id in the other root nodes
                if('@id' in propObject && lookupId[propObject['@id'] as string]) {
                    propObject = {...propObject, ...lookupId[propObject['@id'] as string]};
                }

                // if we're currently looking at a non-system predicate
                if(propName[0] != '@') {

                    // blank node
                    if('@id' in propObject && (propObject['@id'] as string)[0] == '_') {

                        console.log("IS BN", propObject)
                        const bterms = JSONtoTerm(propObject as JSONTerm);
                        const predNode = node(propName);
                        if(propName in lookupId) {
                            setNodePropertiesFromJSON(predNode, lookupId[propName] as JSONTerm);
                        }

                        for(const bterm of bterms) {
                            setProperty(prezNode, properties, propName, predNode, bterm);
                            setAllPropertiesFromJSON(predNode, (bterm as PrezBlankNode).properties, propObject, lookupId)
                        }

                    } else {

                        // translate the object to a term
                        const terms = JSONtoTerm(propObject as JSONTerm);

                        if(terms.length > 1) {
                            console.log("MULTI TERMS")
                        }

                        // const term = terms[0];

                        // console.log(propName, propObject, term);
                        let predNode = node(propName);
                        
                        // this predicate has a lookup with the same id as the pred iri
                        // apply it to prednode
                        if(propName in lookupId) {
                            setNodePropertiesFromJSON(predNode, lookupId[propName] as JSONTerm);
                        }
                        
                        // this predicate has a datatype defined,
                        // so if a lookup object is found, apply it to the prednode
                        if('@type' in propObject) {
                            setNodePropertiesFromJSON(predNode, propObject as JSONTerm);
                        }

                        for(const term of terms) {
                            if('@type' in propObject) {
                                if(lookupId[propObject['@type'] as string]) {
                                    setNodePropertiesFromJSON((term as PrezLiteral).datatype!, lookupId[propObject['@type'] as string] as JSONTerm)
                                }
                            }
                            
                            setProperty(prezNode, properties, propName, predNode, term);
                        }
                    }
                }
            }
        }
    }
    setNodePropertiesFromJSON(prezNode, n as JSONTerm);
}

/**
 * Turn a JSON LD document into a PrezItem data structure
 * 
 * @param doc - JSON LD document to process
 * @returns PrezItem data structure with a focus node and properties
 */
export async function loadJSON(doc: JsonLdDocument) {

    // use json ld framing to standardise the JSON doc
    const docFramed = await frame(doc, {});

    // initialise the PrezItem object
    const prezItem:PrezItem = {
        focusNode: node(''),
        properties: {}        
    }

    // @graph node has the main contents after framing
    if("@graph" in docFramed) {
        const graph = docFramed["@graph"];

        // we expect an array structure
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


// function expandCurie(context:ContextDefinition, iri:string) {
//     if(iri) {
//         const parts = iri.split(':', 2);
//         return (Object.keys(context).filter(prefix=>parts[0] == prefix).map(p=>context[p]) || parts[0]) + parts?.[1];
//     } else {
//         return iri;
//     }
// }

// function toValueCurie(context: ContextDefinition, iri:string): {value: string, curie?: string} {
//     const expanded = expandCurie(context, iri);
//     if(expanded != iri) {
//         return {value: expanded, curie: iri};
//     } else {
//         return {value: iri};
//     }
// }


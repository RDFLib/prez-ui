import { defineStore } from 'pinia'
import axios from 'axios'
import { Util, Store, Parser, DataFactory, type Term } from "n3";


/**
 * @typedef {Object} MatchFilter - A match object type to provide to the N3 match function to filter results
 * @property {Term | null} subject - The subject term to match
 * @property {Term | null} object - The object term to match
 * @property {Term | null} predicate - The predicate term to match
 */
export type MatchFilter = {
    subject?: Term | null,
    object?: Term | null,
    predicate?: Term | null
}

/**
 * @typedef {Object} SimpleQueryResult - This simple query result object is to enable a view to easily work with a result set to display, without needing to worry about getting an id/value or processing of the literal text properly
 * @property {string} subject - The subject of the triple/quad
 * @property {string} predicate - The predicate of the triple/quad
 * @property {string} object - The object of the triple/quad, with the literal value processed if applicable
 */
export type SimpleQueryResult = {
  subject: string,
  predicate: string,
  object: string
}

/**
 * @typedef {Object} DatasetTreeNode - The node containing the item and featureCollection list
 * @property {SimpleQueryResult} item - The item being represented in the tree node
 * @property {SimpleQueryResult[]} featureCollections - The child featureCollections for the given item
 */
export type DatasetTreeNode = {
  item: SimpleQueryResult,
  featureCollections: SimpleQueryResult[]
}

/**
 * @typedef {DatasetTreeNode[]} DatasetTree - This tree object provides a way to store the main list of datasets and child featureCollections
 */
export type DatasetTree = DatasetTreeNode[]


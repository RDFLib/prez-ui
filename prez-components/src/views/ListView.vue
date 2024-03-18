<script lang="ts" setup>
import PrezUIItemList from "../components/PrezUIItemList.vue";
import { Default as listData } from "../stories/PrezUIItemList.stories";

const items = [
  {
    "focusNode": {
      "value": "http://example.com/bblock-catalog/bblocks",
      "termType": "NamedNode",
      "label": {
        "value": "A catalog of Building Block Vocabularies",
        "termType": "Literal",
        "datatype": {
          "value": "http://www.w3.org/2001/XMLSchema#string",
          "termType": "NamedNode"
        }
      }
    },
    "properties": {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
        "predicate": {
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
          "termType": "NamedNode",
          "label": {
            "value": "type",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "http://www.w3.org/ns/dcat#Catalog",
            "termType": "NamedNode",
            "label": {
              "value": "Catalog",
              "termType": "Literal",
              "datatype": {
                "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
                "termType": "NamedNode"
              },
              "language": "en"
            },
            "description": {
              "value": "A curated collection of metadata about resources (e.g., datasets and data services in the context of a data catalog).",
              "termType": "Literal",
              "datatype": {
                "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
                "termType": "NamedNode"
              },
              "language": "en"
            }
          }
        ]
      },
      "http://purl.org/dc/terms/identifier": {
        "predicate": {
          "value": "http://purl.org/dc/terms/identifier",
          "termType": "NamedNode",
          "label": {
            "value": "Identifier",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
              "termType": "NamedNode"
            },
            "language": "en"
          },
          "description": {
            "value": "Recommended practice is to identify the resource by means of a string conforming to an identification system. Examples include International Standard Book Number (ISBN), Digital Object Identifier (DOI), and Uniform Resource Name (URN).  Persistent identifiers should be provided as HTTP URIs.",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
              "termType": "NamedNode"
            },
            "language": "en"
          }
        },
        "objects": [
          {
            "value": "bblck-ctlg:bblocks",
            "termType": "Literal",
            "datatype": {
              "value": "https://prez.dev/identifier",
              "termType": "NamedNode"
            }
          }
        ]
      },
      "http://purl.org/dc/terms/title": {
        "predicate": {
          "value": "http://purl.org/dc/terms/title",
          "termType": "NamedNode",
          "label": {
            "value": "Title",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
              "termType": "NamedNode"
            },
            "language": "en"
          }
        },
        "objects": [
          {
            "value": "A catalog of Building Block Vocabularies",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        ]
      },
      "https://prez.dev/link": {
        "predicate": {
          "value": "https://prez.dev/link",
          "termType": "NamedNode",
          "label": {
            "value": "link",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "/catalogs/bblck-ctlg:bblocks",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        ]
      },
      "https://prez.dev/members": {
        "predicate": {
          "value": "https://prez.dev/members",
          "termType": "NamedNode",
          "label": {
            "value": "members",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "n3-0",
            "properties": {
              "https://prez.dev/link": {
                "predicate": {
                  "value": "https://prez.dev/link",
                  "termType": "NamedNode",
                  "label": {
                    "value": "link",
                    "termType": "Literal",
                    "datatype": {
                      "value": "http://www.w3.org/2001/XMLSchema#string",
                      "termType": "NamedNode"
                    }
                  }
                },
                "objects": [
                  {
                    "value": "/catalogs/bblck-ctlg:bblocks/collections",
                    "termType": "Literal",
                    "datatype": {
                      "value": "http://www.w3.org/2001/XMLSchema#string",
                      "termType": "NamedNode"
                    }
                  }
                ]
              }
            },
            "termType": "BlankNode"
          }
        ]
      }
    }
  },
  {
    "focusNode": {
      "value": "https://example.com/TopLevelCatalog",
      "termType": "NamedNode",
      "label": {
        "value": "Top level catalog",
        "termType": "Literal",
        "datatype": {
          "value": "http://www.w3.org/2001/XMLSchema#string",
          "termType": "NamedNode"
        }
      }
    },
    "properties": {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
        "predicate": {
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
          "termType": "NamedNode",
          "label": {
            "value": "type",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "http://www.w3.org/ns/dcat#Catalog",
            "termType": "NamedNode",
            "label": {
              "value": "Catalog",
              "termType": "Literal",
              "datatype": {
                "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
                "termType": "NamedNode"
              },
              "language": "en"
            },
            "description": {
              "value": "A curated collection of metadata about resources (e.g., datasets and data services in the context of a data catalog).",
              "termType": "Literal",
              "datatype": {
                "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
                "termType": "NamedNode"
              },
              "language": "en"
            }
          }
        ]
      },
      "http://purl.org/dc/terms/identifier": {
        "predicate": {
          "value": "http://purl.org/dc/terms/identifier",
          "termType": "NamedNode",
          "label": {
            "value": "Identifier",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
              "termType": "NamedNode"
            },
            "language": "en"
          },
          "description": {
            "value": "Recommended practice is to identify the resource by means of a string conforming to an identification system. Examples include International Standard Book Number (ISBN), Digital Object Identifier (DOI), and Uniform Resource Name (URN).  Persistent identifiers should be provided as HTTP URIs.",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
              "termType": "NamedNode"
            },
            "language": "en"
          }
        },
        "objects": [
          {
            "value": "exm:TopLevelCatalog",
            "termType": "Literal",
            "datatype": {
              "value": "https://prez.dev/identifier",
              "termType": "NamedNode"
            }
          }
        ]
      },
      "https://prez.dev/link": {
        "predicate": {
          "value": "https://prez.dev/link",
          "termType": "NamedNode",
          "label": {
            "value": "link",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "/catalogs/exm:TopLevelCatalog",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        ]
      },
      "https://prez.dev/members": {
        "predicate": {
          "value": "https://prez.dev/members",
          "termType": "NamedNode",
          "label": {
            "value": "members",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "n3-1",
            "properties": {
              "https://prez.dev/link": {
                "predicate": {
                  "value": "https://prez.dev/link",
                  "termType": "NamedNode",
                  "label": {
                    "value": "link",
                    "termType": "Literal",
                    "datatype": {
                      "value": "http://www.w3.org/2001/XMLSchema#string",
                      "termType": "NamedNode"
                    }
                  }
                },
                "objects": [
                  {
                    "value": "/catalogs/exm:TopLevelCatalog/collections",
                    "termType": "Literal",
                    "datatype": {
                      "value": "http://www.w3.org/2001/XMLSchema#string",
                      "termType": "NamedNode"
                    }
                  }
                ]
              }
            },
            "termType": "BlankNode"
          }
        ]
      },
      "http://www.w3.org/2000/01/rdf-schema#label": {
        "predicate": {
          "value": "http://www.w3.org/2000/01/rdf-schema#label",
          "termType": "NamedNode",
          "label": {
            "value": "label",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "Top level catalog",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        ]
      }
    }
  },
  {
    "focusNode": {
      "value": "https://example.com/TopLevelCatalogTwo",
      "termType": "NamedNode",
      "label": {
        "value": "amazing catalog",
        "termType": "Literal",
        "datatype": {
          "value": "http://www.w3.org/2001/XMLSchema#string",
          "termType": "NamedNode"
        }
      }
    },
    "properties": {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
        "predicate": {
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
          "termType": "NamedNode",
          "label": {
            "value": "type",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "http://www.w3.org/ns/dcat#Catalog",
            "termType": "NamedNode",
            "label": {
              "value": "Catalog",
              "termType": "Literal",
              "datatype": {
                "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
                "termType": "NamedNode"
              },
              "language": "en"
            },
            "description": {
              "value": "A curated collection of metadata about resources (e.g., datasets and data services in the context of a data catalog).",
              "termType": "Literal",
              "datatype": {
                "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
                "termType": "NamedNode"
              },
              "language": "en"
            }
          }
        ]
      },
      "http://purl.org/dc/terms/identifier": {
        "predicate": {
          "value": "http://purl.org/dc/terms/identifier",
          "termType": "NamedNode",
          "label": {
            "value": "Identifier",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
              "termType": "NamedNode"
            },
            "language": "en"
          },
          "description": {
            "value": "Recommended practice is to identify the resource by means of a string conforming to an identification system. Examples include International Standard Book Number (ISBN), Digital Object Identifier (DOI), and Uniform Resource Name (URN).  Persistent identifiers should be provided as HTTP URIs.",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
              "termType": "NamedNode"
            },
            "language": "en"
          }
        },
        "objects": [
          {
            "value": "exm:TopLevelCatalogTwo",
            "termType": "Literal",
            "datatype": {
              "value": "https://prez.dev/identifier",
              "termType": "NamedNode"
            }
          }
        ]
      },
      "https://prez.dev/link": {
        "predicate": {
          "value": "https://prez.dev/link",
          "termType": "NamedNode",
          "label": {
            "value": "link",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "/catalogs/exm:TopLevelCatalogTwo",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        ]
      },
      "https://prez.dev/members": {
        "predicate": {
          "value": "https://prez.dev/members",
          "termType": "NamedNode",
          "label": {
            "value": "members",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "n3-2",
            "properties": {
              "https://prez.dev/link": {
                "predicate": {
                  "value": "https://prez.dev/link",
                  "termType": "NamedNode",
                  "label": {
                    "value": "link",
                    "termType": "Literal",
                    "datatype": {
                      "value": "http://www.w3.org/2001/XMLSchema#string",
                      "termType": "NamedNode"
                    }
                  }
                },
                "objects": [
                  {
                    "value": "/catalogs/exm:TopLevelCatalogTwo/collections",
                    "termType": "Literal",
                    "datatype": {
                      "value": "http://www.w3.org/2001/XMLSchema#string",
                      "termType": "NamedNode"
                    }
                  }
                ]
              }
            },
            "termType": "BlankNode"
          }
        ]
      },
      "http://www.w3.org/2000/01/rdf-schema#label": {
        "predicate": {
          "value": "http://www.w3.org/2000/01/rdf-schema#label",
          "termType": "NamedNode",
          "label": {
            "value": "label",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "amazing catalog",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        ]
      }
    }
  },
  {
    "focusNode": {
      "value": "https://example.com/VocPrezCatalog",
      "termType": "NamedNode",
      "label": {
        "value": "A Demo Catalog",
        "termType": "Literal",
        "datatype": {
          "value": "http://www.w3.org/2001/XMLSchema#string",
          "termType": "NamedNode"
        }
      }
    },
    "properties": {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
        "predicate": {
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
          "termType": "NamedNode",
          "label": {
            "value": "type",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "http://www.w3.org/ns/dcat#Catalog",
            "termType": "NamedNode",
            "label": {
              "value": "Catalog",
              "termType": "Literal",
              "datatype": {
                "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
                "termType": "NamedNode"
              },
              "language": "en"
            },
            "description": {
              "value": "A curated collection of metadata about resources (e.g., datasets and data services in the context of a data catalog).",
              "termType": "Literal",
              "datatype": {
                "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
                "termType": "NamedNode"
              },
              "language": "en"
            }
          }
        ]
      },
      "http://purl.org/dc/terms/identifier": {
        "predicate": {
          "value": "http://purl.org/dc/terms/identifier",
          "termType": "NamedNode",
          "label": {
            "value": "Identifier",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
              "termType": "NamedNode"
            },
            "language": "en"
          },
          "description": {
            "value": "Recommended practice is to identify the resource by means of a string conforming to an identification system. Examples include International Standard Book Number (ISBN), Digital Object Identifier (DOI), and Uniform Resource Name (URN).  Persistent identifiers should be provided as HTTP URIs.",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
              "termType": "NamedNode"
            },
            "language": "en"
          }
        },
        "objects": [
          {
            "value": "exm:VocPrezCatalog",
            "termType": "Literal",
            "datatype": {
              "value": "https://prez.dev/identifier",
              "termType": "NamedNode"
            }
          }
        ]
      },
      "https://prez.dev/link": {
        "predicate": {
          "value": "https://prez.dev/link",
          "termType": "NamedNode",
          "label": {
            "value": "link",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "/catalogs/exm:VocPrezCatalog",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        ]
      },
      "https://prez.dev/members": {
        "predicate": {
          "value": "https://prez.dev/members",
          "termType": "NamedNode",
          "label": {
            "value": "members",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "n3-3",
            "properties": {
              "https://prez.dev/link": {
                "predicate": {
                  "value": "https://prez.dev/link",
                  "termType": "NamedNode",
                  "label": {
                    "value": "link",
                    "termType": "Literal",
                    "datatype": {
                      "value": "http://www.w3.org/2001/XMLSchema#string",
                      "termType": "NamedNode"
                    }
                  }
                },
                "objects": [
                  {
                    "value": "/catalogs/exm:VocPrezCatalog/collections",
                    "termType": "Literal",
                    "datatype": {
                      "value": "http://www.w3.org/2001/XMLSchema#string",
                      "termType": "NamedNode"
                    }
                  }
                ]
              }
            },
            "termType": "BlankNode"
          }
        ]
      },
      "http://www.w3.org/2000/01/rdf-schema#label": {
        "predicate": {
          "value": "http://www.w3.org/2000/01/rdf-schema#label",
          "termType": "NamedNode",
          "label": {
            "value": "label",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        },
        "objects": [
          {
            "value": "A Demo Catalog",
            "termType": "Literal",
            "datatype": {
              "value": "http://www.w3.org/2001/XMLSchema#string",
              "termType": "NamedNode"
            }
          }
        ]
      }
    }
  }
];
</script>

<template>
    <div>
        <PrezUIItemList :items="items" />
    </div>
</template>

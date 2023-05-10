const getPrezSystemLabel = (key: string) => {
  const prezKeyLabelMapping: { [key: string]: string } = {
    VocPrez: "Vocabularies",
    SpacePrez: "Spatial Data Catalog",
    CatPrez: "Data Catalog",
  };

  if (key in prezKeyLabelMapping) {
    return prezKeyLabelMapping[key];
  }

  return key;
};

export { getPrezSystemLabel };

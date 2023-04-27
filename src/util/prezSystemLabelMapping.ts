const getPrezSystemLabel = (key: string) => {
  const prezKeyLabelMapping: { [key: string]: string } = {
    VocPrez: "Vocabularies",
    SpacePrez: "Spatial Data",
    CatPrez: "Catalog Data",
  };

  if (key in prezKeyLabelMapping) {
    return prezKeyLabelMapping[key];
  }

  return key;
};

export { getPrezSystemLabel };

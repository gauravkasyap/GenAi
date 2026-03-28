export function findSymptomLabel(symptoms, id, language) {
  const symptom = symptoms.find((item) => item.id === id);
  return symptom?.labels?.[language] ?? symptom?.labels?.en ?? id;
}

export function findPersonaLabel(personas, id, language) {
  const persona = personas.find((item) => item.id === id);
  return persona?.labels?.[language] ?? persona?.labels?.en ?? id;
}

export function toolTitle(activeTool, labels = {}) {
  if (activeTool === "prescription") return labels.prescription ?? "Add photos & files";
  if (activeTool === "finder") return labels.finder ?? "Facility finder";
  if (activeTool === "sources") return labels.sources ?? "Deep research";
  if (activeTool === "books") return labels.books ?? "Read Medical Book";
  return labels.triage ?? "Thinking";
}

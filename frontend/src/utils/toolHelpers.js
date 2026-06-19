export function toolTitle(tool, titles) {
  return titles?.[tool] ?? "Tool";
}

export function findPersonaLabel(
  personas,
  id,
  language
) {
  const persona = personas.find(
    (item) => item.id === id
  );

  if (!persona) return id;

  return (
    persona.labels?.[language] ??
    persona.label ??
    persona.name ??
    id
  );
}

export function findSymptomLabel(
  symptoms,
  id,
  language
) {
  const symptom = symptoms.find(
    (item) => item.id === id
  );

  if (!symptom) return id;

  return (
    symptom.labels?.[language] ??
    symptom.label ??
    symptom.name ??
    id
  );
}
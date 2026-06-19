import React from "react";
import SelectField from "../common/SelectField";
import {
  toolTitle,
  findPersonaLabel,
  findSymptomLabel,
} from "../../utils/toolHelpers";

export default function ToolSheet({
  showQuickActionSheet,
  ui,
  bookUi,

  activeTool,
  bootstrap,

  language,

  personas,
  persona,
  setPersona,

  symptoms,
  selectedSymptoms,
  toggleSymptom,

  duration,
  setDuration,
  durationOptions,

  intensity,
  setIntensity,
  intensityOptions,

  triageState,
  setTriageState,

  triageDistrict,
  setTriageDistrict,

  finderStates,
  triageDistricts,

  prescriptionInput,
  setPrescriptionInput,
  prescriptionAttachment,
  setPrescriptionAttachment,
  runPrescription,
  explainingPrescription,

  finderState,
  setFinderState,

  finderDistrict,
  setFinderDistrict,

  finderDistricts,

  specialty,
  setSpecialty,
  specialtyEntries,

  runFinder,
  searchingFacilities,

  setToolSheetOpen,
}) {
  if (!showQuickActionSheet) {
    return null;
  }

  function handlePrescriptionFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isTextFile =
      file.type.startsWith("text/") ||
      /\.(txt|md|csv)$/i.test(file.name);

    reader.onload = () => {
      if (isTextFile) {
        setPrescriptionInput(String(reader.result ?? ""));
        setPrescriptionAttachment(null);
        return;
      }

      setPrescriptionInput("");
      setPrescriptionAttachment({
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        contentBase64: String(reader.result ?? ""),
      });
    };

    if (isTextFile) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  }

  return (
    <div className="absolute inset-x-4 bottom-15 z-20 md:inset-x-8">
      <div className="mx-auto max-w-3xl rounded-[1.6rem] border border-white/10 bg-[#111111]/92 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl">

        {/* Header */}

        <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/8 pb-4">

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">
              {ui.tools.quickActions}
            </p>

            <h3 className="text-xl font-semibold text-white">
              {toolTitle(activeTool, {
                ...ui.toolTitles,
                books: bookUi.sectionTitle,
              })}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setToolSheetOpen(false)}
            className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-white/70"
          >
            {ui.tools.close}
          </button>

        </div>

        <div className="max-h-[55vh] overflow-y-auto pr-1">

          {/* TRIAGE */}

          {activeTool === "triage" && (

            <div className="grid gap-4 lg:grid-cols-2">

              <div className="lg:col-span-2">

                <p className="mb-2 text-sm text-white/55">
                  {ui.tools.whoNeedsHelp}
                </p>

                <div className="flex flex-wrap gap-2">

                  {personas.map((item) => (

                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPersona(item.id)}
                      className={`rounded-2xl px-4 py-2 text-sm transition ${
                        persona === item.id
                          ? "bg-white text-[#171514]"
                          : "bg-white/[0.06] text-white/75 hover:bg-white/[0.1]"
                      }`}
                    >
                      {findPersonaLabel(
                        personas,
                        item.id,
                        language
                      )}
                    </button>

                  ))}

                </div>

              </div>

              <div className="lg:col-span-2">

                <p className="mb-2 text-sm text-white/55">
                  {ui.tools.quickSymptoms}
                </p>

                <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">

                  {symptoms.map((item) => (

                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSymptom(item.id)}
                      className={`rounded-2xl px-4 py-2 text-sm transition ${
                        selectedSymptoms.includes(item.id)
                          ? "bg-[#2563eb] text-white"
                          : "bg-white/[0.06] text-white/75 hover:bg-white/[0.1]"
                      }`}
                    >
                      {findSymptomLabel(
                        symptoms,
                        item.id,
                        language
                      )}
                    </button>

                  ))}

                </div>

              </div>

              <SelectField
                label={ui.tools.howLong}
                value={duration}
                onChange={setDuration}
                options={durationOptions}
              />

              <SelectField
                label={ui.tools.howSerious}
                value={intensity}
                onChange={setIntensity}
                options={intensityOptions}
              />

              <SelectField
                label={ui.tools.state}
                value={triageState}
                onChange={(value) => {
                  setTriageState(value);
                  setTriageDistrict("");
                }}
                options={finderStates.map((item) => [item, item])}
                emptyLabel={ui.tools.selectState}
              />

              <SelectField
                label={ui.tools.district}
                value={triageDistrict}
                onChange={setTriageDistrict}
                options={triageDistricts.map((item) => [item, item])}
                emptyLabel={ui.tools.selectDistrict}
              />

            </div>
          )}          {/* PRESCRIPTION */}

          {activeTool === "prescription" && (

            <div className="grid gap-4">

              <label className="grid gap-2 rounded-[1.4rem] border border-dashed border-white/12 bg-black/20 px-4 py-4 text-sm text-white/65">
                <span className="font-medium text-white">
                  Upload prescription
                </span>
                <span className="text-xs leading-5 text-white/40">
                  Supports text files, PDFs, and prescription images.
                </span>
                <input
                  type="file"
                  accept=".txt,.md,.csv,.pdf,image/*"
                  onChange={handlePrescriptionFile}
                  className="block w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-blue-500/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-blue-100 hover:file:bg-blue-500/20"
                />
                {prescriptionAttachment ? (
                  <span className="rounded-xl border border-blue-300/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-100">
                    Selected: {prescriptionAttachment.name}
                  </span>
                ) : null}
              </label>

              <textarea
                value={prescriptionInput}
                onChange={(event) =>
                  setPrescriptionInput(event.target.value)
                }
                rows={6}
                placeholder={ui.tools.pastePrescription}
                className="w-full rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-white/25"
              />

              <button
                type="button"
                onClick={runPrescription}
                disabled={explainingPrescription}
                className="rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6] disabled:opacity-60"
              >
                {explainingPrescription
                  ? ui.tools.working
                  : ui.tools.explainPrescription}
              </button>

            </div>

          )}

          {/* FINDER */}

          {activeTool === "finder" && (

            <div className="grid gap-4 md:grid-cols-3">

              <SelectField
                label={ui.tools.state}
                value={finderState}
                onChange={(value) => {
                  setFinderState(value);
                  setFinderDistrict("");
                }}
                options={finderStates.map((item) => [item, item])}
                emptyLabel={ui.tools.selectState}
              />

              <SelectField
                label={ui.tools.district}
                value={finderDistrict}
                onChange={setFinderDistrict}
                options={finderDistricts.map((item) => [item, item])}
                emptyLabel={ui.tools.selectDistrict}
              />

              <SelectField
                label={ui.tools.neededSpecialty}
                value={specialty}
                onChange={setSpecialty}
                options={specialtyEntries}
                emptyLabel={ui.tools.selectSpecialty}
              />

              <div className="md:col-span-3">

                <button
                  type="button"
                  onClick={runFinder}
                  disabled={searchingFacilities}
                  className="rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6] disabled:opacity-60"
                >
                  {searchingFacilities
                    ? ui.tools.searching
                    : ui.tools.findFacilities}
                </button>

              </div>

            </div>

          )}

          {/* SOURCES */}

          {activeTool === "sources" && (

            <div className="grid gap-3 md:grid-cols-2">

              {(bootstrap?.knowledgeTopics ?? []).map((topic) => (

                <article
                  key={topic.id}
                  className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] p-4"
                >

                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    {topic.source_name}
                  </p>

                  <h4 className="mt-2 text-lg font-semibold text-white">
                    {topic.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {topic.summary}
                  </p>

                  <a
                    href={topic.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-medium text-[#7dd3fc]"
                  >
                    {ui.tools.openSource}
                  </a>

                </article>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}

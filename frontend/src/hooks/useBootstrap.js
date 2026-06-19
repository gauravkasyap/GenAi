import { useEffect, useState } from "react";

import { fetchBootstrap } from "../services/api";

const FALLBACK_BOOTSTRAP = {
  languages: [],
  personas: [],
  symptoms: [],
  states: {},
  knowledgeTopics: [],
  specialties: {},
  facilityTypes: {},
};

export function useBootstrap() {
  const [bootstrap, setBootstrap] = useState(() => {
    const cached = localStorage.getItem("bootstrapCache");
    if (!cached) return FALLBACK_BOOTSTRAP;

    try {
      return { ...FALLBACK_BOOTSTRAP, ...JSON.parse(cached) };
    } catch {
      return FALLBACK_BOOTSTRAP;
    }
  });

  useEffect(() => {
    let cancelled = false;

    fetchBootstrap("bootstrapCache")
      .then((data) => {
        if (!cancelled) {
          setBootstrap({ ...FALLBACK_BOOTSTRAP, ...data });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return bootstrap;
}

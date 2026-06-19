import React from "react";

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  emptyLabel = "Select",
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-white/55">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
      >
        <option value="">
          {emptyLabel}
        </option>

        {options.map((item) => {
          const value = Array.isArray(item)
            ? item[0]
            : item.value;

          const label = Array.isArray(item)
            ? item[1]
            : item.label;

          return (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          );
        })}
      </select>
    </label>
  );
}
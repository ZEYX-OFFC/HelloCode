"use client";
import { ChevronDown } from "lucide-react";

export default function ModelPicker({
  models,
  value,
  onChange,
}: {
  models: { id: string; name: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-gray-100 border border-gray-200 rounded-lg pl-3 pr-9 py-2 text-sm focus:outline-none"
      >
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
    </div>
  );
}

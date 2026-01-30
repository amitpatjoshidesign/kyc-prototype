"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { FileText as FileTextIcon, X as XIcon } from "@phosphor-icons/react";

interface FileUploadFieldProps {
  label: string;
  file?: File | null;
  helperText?: string;
  onFileSelect?: (file: File) => void;
  onClear?: () => void;
}

export default function FileUploadField({
  label,
  file,
  helperText,
  onFileSelect,
  onClear,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Reset for next selection
    e.target.value = "";

    if (selected.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setError(null);
    onFileSelect?.(selected);
  };

  const handleClear = () => {
    setError(null);
    onClear?.();
  };

  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
      />
      <div
        onClick={file ? undefined : handleClick}
        className={`flex h-9 items-center rounded-md border bg-white px-3 text-sm ${
          error ? "border-red-400" : "border-stone-300"
        } ${!file ? "cursor-pointer hover:border-stone-400" : ""}`}
      >
        {file ? (
          <>
            <FileTextIcon size={16} className="mr-2 shrink-0 text-stone-400" />
            <span className="flex-1 truncate text-stone-700">{file.name}</span>
            <button
              onClick={handleClear}
              className="ml-2 shrink-0 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label={`Remove ${file.name}`}
            >
              <XIcon size={16} />
            </button>
          </>
        ) : (
          <span className="text-stone-400">Choose file...</span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-stone-400">{helperText}</p>
      )}
    </div>
  );
}

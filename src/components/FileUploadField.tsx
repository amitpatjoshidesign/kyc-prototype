"use client";

import { useRef, useState } from "react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
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
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel>{label}</FieldLabel>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
      />
      <div
        onClick={file ? undefined : handleClick}
        className={`flex h-9 items-center rounded-md border bg-white dark:bg-transparent px-3 text-sm ${
          error ? "border-red-400" : "border-stone-300 dark:border-input"
        } ${!file ? "cursor-pointer hover:border-stone-400 dark:hover:border-ring" : ""}`}
      >
        {file ? (
          <>
            <FileTextIcon size={16} className="mr-2 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-foreground">{file.name}</span>
            <button
              onClick={handleClear}
              className="ml-2 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Remove ${file.name}`}
            >
              <XIcon size={16} />
            </button>
          </>
        ) : (
          <span className="text-muted-foreground">Choose file...</span>
        )}
      </div>
      {error && <FieldError>{error}</FieldError>}
      {!error && helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </Field>
  );
}

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, Image as ImageIcon, FileSpreadsheet, File } from "lucide-react";
import { api } from "@/lib/api";
import { cn, formatBytes } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

const ACCEPT = ".pdf,.csv,.docx,.png,.jpg,.jpeg";
const MAX_BYTES = 10 * 1024 * 1024;

export function UploadZone({ onUploaded }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback(
    async (files) => {
      setError("");
      const file = files?.[0];
      if (!file) return;
      if (file.size > MAX_BYTES) {
        setError(`File too large (${formatBytes(file.size)}). Limit is 10 MB.`);
        return;
      }
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        await api.post("/documents/upload", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onUploaded?.();
      } catch (e) {
        setError(e.response?.data?.detail?.message ?? e.message ?? "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer rounded-2xl p-8 text-center",
          "border-2 border-dashed transition-all duration-200",
          dragging
            ? "border-accent-400 bg-accent-500/[0.08]"
            : "border-white/10 hover:border-accent-500/40 hover:bg-white/[0.02]"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "relative w-14 h-14 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br from-accent-500/20 to-accent-700/20",
              "ring-1 ring-accent-500/30",
              "group-hover:ring-accent-400/50 group-hover:shadow-glow transition-all"
            )}
          >
            {uploading ? <Spinner size={22} /> : <Upload className="text-accent-300" size={22} />}
          </div>
          <div>
            <p className="text-zinc-100 font-medium">
              {uploading ? "Uploading…" : "Drop a document or click to upload"}
            </p>
            <p className="text-zinc-500 text-sm mt-0.5">
              PDF · CSV · DOCX · PNG/JPG — up to 10 MB
            </p>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
            <span className="inline-flex items-center gap-1">
              <FileText size={12} /> PDF
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <FileSpreadsheet size={12} /> CSV
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <File size={12} /> DOCX
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <ImageIcon size={12} /> Images
            </span>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && (
        <p className="mt-3 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}

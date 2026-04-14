import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * A simple split-pane Markdown editor.
 * Install react-markdown for the preview:  npm i react-markdown
 *
 * Swap the raw <pre> below with:
 *   import ReactMarkdown from "react-markdown";
 *   <ReactMarkdown>{value}</ReactMarkdown>
 */
export default function MarkdownEditor({ value, onChange, placeholder }: Props) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize ${
              tab === t
                ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Write in Markdown…"}
          rows={16}
          className="w-full p-4 text-sm font-mono focus:outline-none resize-y"
        />
      ) : (
        <div className="p-4 min-h-[16rem] prose prose-sm max-w-none">
          {value ? (
            /* Replace this <pre> with <ReactMarkdown> once installed */
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">{value}</pre>
          ) : (
            <p className="text-gray-400 italic">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

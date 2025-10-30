"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function HomePage() {
  const [text, setText] = useState<string>(
    "¡Hola! Éste es un párrafo con tildes y caracteres especiales: á, é, í, ó, ú, ñ, ü, ¿, ¡."
  );

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "texto-impresion",
  } as any);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-4">🖨️ Text Printer</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full max-w-2xl border border-gray-400 p-3 rounded-md text-lg font-mono"
      />

      <div ref={printRef} className="hidden print:block mt-8">
        <pre className="font-mono text-lg whitespace-pre-wrap">{text}</pre>
      </div>

      <button
        onClick={handlePrint}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Imprimir
      </button>
    </main>
  );
}

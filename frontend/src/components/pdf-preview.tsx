import { useEffect, useRef, useState } from "react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

type PdfPreviewProps = {
  src: string;
  className?: string;
  fallbackLabel?: string;
};

export function PdfPreview({ src, className = "", fallbackLabel = "Open PDF" }: PdfPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!src || !canvasRef.current) return;

    let canceled = false;
    setError(null);
    setLoading(true);

    let loadingTask: any;

    const loadPdf = async () => {
      try {
        const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as any;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        loadingTask = pdfjs.getDocument({ url: src });
        const pdf = await loadingTask.promise;
        if (canceled) return;

        const page = await pdf.getPage(1);
        if (canceled) return;

        const initialViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(1.0, 900 / initialViewport.width);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas context unavailable");

        await page.render({ canvas, canvasContext: context, viewport }).promise;
        if (canceled) return;

        setLoading(false);
      } catch (err) {
        if (canceled) return;
        console.error("PDF preview error", err);
        setError("Preview unavailable");
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      canceled = true;
      if (loadingTask?.destroy) loadingTask.destroy();
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-border bg-card ${className}`}>
      {loading && !error ? (
        <div className="flex h-full min-h-[192px] items-center justify-center px-4 py-6 text-sm text-muted-foreground">
          Loading PDF preview…
        </div>
      ) : error ? (
        <div className="flex h-full min-h-[192px] flex-col items-center justify-center gap-3 px-4 py-6 text-sm text-muted-foreground">
          <p>{error}. </p>
          <a href={src} target="_blank" rel="noreferrer" className="text-primary underline">
            {fallbackLabel}
          </a>
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-full" />
      )}
    </div>
  );
}

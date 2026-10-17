"use client";

import { FileDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DownloadReportData } from "./report-download";

export default function ReportDownloadButton({
  report,
}: {
  report: Omit<DownloadReportData, "recipientName" | "recipientEmail" | "organization">;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsGenerating(true);

    const formData = new FormData(event.currentTarget);
    try {
      const { downloadTransparencyReport } = await import("./report-download");
      downloadTransparencyReport({
        ...report,
        recipientName: String(formData.get("name") ?? "").trim(),
        recipientEmail: String(formData.get("email") ?? "").trim(),
        organization: String(formData.get("organization") ?? "").trim(),
      });
      setIsOpen(false);
    } catch {
      setError("Le PDF n’a pas pu être généré. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <button className="report-download-button" type="button" onClick={() => setIsOpen(true)}>
        <FileDown size={15} />
        Télécharger le rapport
      </button>

      <dialog
        className="report-dialog"
        ref={dialogRef}
        aria-labelledby="report-dialog-title"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setIsOpen(false);
        }}
      >
        <div className="report-dialog-header">
          <div>
            <div className="section-kicker">EXPORT PDF</div>
            <h2 id="report-dialog-title">Personnaliser le rapport</h2>
          </div>
          <button
            className="report-dialog-close"
            type="button"
            aria-label="Fermer"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <p className="report-dialog-intro">
          Indiquez vos coordonnées pour les ajouter au rapport téléchargé.
        </p>

        <form className="report-dialog-form" onSubmit={handleSubmit}>
          <label>
            Nom
            <input autoFocus name="name" autoComplete="name" required maxLength={120} />
          </label>
          <label>
            Adresse e-mail
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label>
            Organisation <span>(facultatif)</span>
            <input name="organization" autoComplete="organization" maxLength={120} />
          </label>
          <p className="report-privacy-note">
            Ces informations sont utilisées uniquement pour personnaliser le PDF. Elles ne
            sont ni envoyées ni enregistrées.
          </p>
          {error && <p className="report-form-error" role="alert">{error}</p>}
          <button className="report-dialog-submit" type="submit" disabled={isGenerating}>
            <FileDown size={16} />
            {isGenerating ? "Préparation du PDF…" : "Générer et télécharger le PDF"}
          </button>
        </form>
      </dialog>
    </>
  );
}

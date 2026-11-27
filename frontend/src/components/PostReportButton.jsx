
import { useState } from "react";
import { api } from "../api.js";

export default function PostReportButton({ postId, token }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("spam");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        if (saving) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const result = await api(`/posts/${postId}/reports`, {
                token,
                method: "POST",
                body: { reason },
            });

            setSuccess(result.message);
            setOpen(false);
        } catch (err) {
            setError(err.message || "Erro ao registrar denúncia.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="post-report">
            {!open && !success && (
                <button
                    type="button"
                    className="post-report-trigger"
                    onClick={() => {
                        setError("");
                        setOpen(true);
                    }}
                >
                    Denunciar publicação
                </button>
            )}

            {open && (
                <form
                    className="post-report-form"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor={`report-reason-${postId}`}>
                        Motivo da denúncia
                    </label>

                    <select
                        id={`report-reason-${postId}`}
                        value={reason}
                        onChange={(event) =>
                            setReason(event.target.value)
                        }
                    >
                        <option value="spam">
                            Spam ou publicidade
                        </option>
                        <option value="offensive">
                            Conteúdo ofensivo
                        </option>
                        <option value="inappropriate">
                            Conteúdo inadequado
                        </option>
                        <option value="other">
                            Outro motivo
                        </option>
                    </select>

                    <div className="post-report-actions">
                        <button
                            type="button"
                            className="outline"
                            disabled={saving}
                            onClick={() => {
                                setOpen(false);
                                setError("");
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="primary"
                            disabled={saving}
                        >
                            {saving ? "Enviando..." : "Enviar denúncia"}
                        </button>
                    </div>
                </form>
            )}

            {success && (
                <p className="post-report-success" role="status">
                    {success}
                </p>
            )}

            {error && (
                <p className="post-report-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

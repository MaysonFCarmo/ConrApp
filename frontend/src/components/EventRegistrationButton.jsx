
import { useEffect, useState } from "react";
import { CheckCircle2, Ticket, XCircle } from "lucide-react";
import { api } from "../api.js";

export default function EventRegistrationButton({
    eventId,
    token,
    eventDate,
    eventTime,
}) {
    const [registered, setRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const getCurrentBrazilDateTime = () => {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }).formatToParts(new Date());

        const values = Object.fromEntries(
            parts.map(({ type, value }) => [type, value])
        );

        return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
    };

    const eventDateTime = `${eventDate}T${eventTime}`;
    const isPast = eventDateTime <= getCurrentBrazilDateTime();

    useEffect(() => {
        let active = true;

        setLoading(true);
        setError("");
        setMessage("");

        api(`/events/${eventId}/registration`, { token })
            .then((data) => {
                if (active) {
                    setRegistered(data.registered);
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [eventId, token]);

    async function toggleRegistration() {
        setSaving(true);
        setError("");
        setMessage("");

        try {
            const result = await api(
                `/events/${eventId}/register`,
                {
                    token,
                    method: registered ? "DELETE" : "POST",
                }
            );

            setRegistered(result.registered);
            setMessage(result.message);
        } catch (err) {
            setError(err.message || "Erro ao atualizar inscrição.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="event-registration-loading">
                Consultando inscrição...
            </div>
        );
    }
    if (isPast && !registered && !error) {
        return (
            <div className="event-registration">
                <button
                    type="button"
                    className="event-registration-button event-closed"
                    disabled
                >
                    Inscrições encerradas
                </button>
            </div>
        );
    }
    return (
        <div className="event-registration">
            <button
                type="button"
                className={
                    registered
                        ? "event-registration-button registered"
                        : "event-registration-button"
                }
                onClick={toggleRegistration}
                disabled={saving || Boolean(error)}
            >
                {registered ? (
                    <XCircle size={17} />
                ) : (
                    <Ticket size={17} />
                )}

                {saving
                    ? "Processando..."
                    : registered
                        ? "Cancelar participação"
                        : "Confirmar participação"}
            </button>

            {registered && (
                <span className="event-registered-label">
                    <CheckCircle2 size={15} />
                    Inscrição confirmada
                </span>
            )}

            {message && (
                <small className="event-registration-success" role="status">
                    {message}
                </small>
            )}

            {error && (
                <small className="event-registration-error" role="alert">
                    {error}
                </small>
            )}
        </div>
    );
}

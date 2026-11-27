
import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { api } from "../api.js";

export default function NotificationBell({ token }) {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function loadNotifications() {
        try {
            const result = await api("/notifications", { token });
            setNotifications(result);
            setError("");
        } catch (err) {
            setError(err.message || "Erro ao carregar notificações.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) return;

        loadNotifications();

        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, [token]);

    async function markAsRead(id) {
        if (saving) return;
        setSaving(true);

        try {
            await api(`/notifications/${id}/read`, {
                token,
                method: "PATCH",
            });
            await loadNotifications();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function markAllAsRead() {
        if (saving) return;
        setSaving(true);

        try {
            await api("/notifications/read-all", {
                token,
                method: "PATCH",
            });
            await loadNotifications();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notification-wrapper">
            <button
                type="button"
                className="notification-trigger"
                aria-label={`Notificações: ${unreadCount} não lidas`}
                aria-expanded={open}
                onClick={() => {
                    setOpen(!open);
                    if (!open) loadNotifications();
                }}
            >
                <Bell size={20} />

                {unreadCount > 0 && (
                    <span className="notification-count">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="notification-panel">
                    <div className="notification-header">
                        <h3>Notificações</h3>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="notification-read-all"
                                disabled={saving}
                                onClick={markAllAsRead}
                            >
                                <CheckCheck size={15} />
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    {error && (
                        <p className="notification-error" role="alert">
                            {error}
                        </p>
                    )}

                    {loading ? (
                        <p className="notification-empty">
                            Carregando...
                        </p>
                    ) : notifications.length === 0 ? (
                        <p className="notification-empty">
                            Nenhuma notificação no momento.
                        </p>
                    ) : (
                        <div className="notification-list">
                            {notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${
                                        notification.read ? "read" : "unread"
                                    }`}
                                >
                                    <strong>{notification.title}</strong>

                                    <p>{notification.message}</p>

                                    <small>
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleString("pt-BR")}
                                    </small>

                                    {!notification.read && (
                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                        >
                                            Marcar como lida
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

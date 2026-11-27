
import { useState } from "react";
import { api } from "../api.js";

export default function PasswordRecovery({ initialEmail, onBack }) {
    const [email, setEmail] = useState(initialEmail || "");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState("request");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function requestCode(e) {
        e.preventDefault();
        setError("");
        setBusy(true);

        try {
            const result = await api("/auth/forgot-password", {
                method: "POST",
                body: { email: email.trim() }
            });

            setMessage(result.message);
            setStep("reset");
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    async function resetPassword(e) {
        e.preventDefault();
        setError("");

        if (!/^\d{6}$/.test(code.trim())) {
            setError("Informe o código de 6 dígitos.");
            return;
        }

        if (newPassword.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("As senhas informadas não coincidem.");
            return;
        }

        setBusy(true);

        try {
            const result = await api("/auth/reset-password", {
                method: "POST",
                body: {
                    email: email.trim(),
                    code: code.trim(),
                    newPassword
                }
            });

            setMessage(result.message);
            setCode("");
            setNewPassword("");
            setConfirmPassword("");
            setStep("success");
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="password-recovery">
            {step === "request" && (
                <form onSubmit={requestCode}>
                    <label>
                        E-mail cadastrado
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <p className="recovery-hint">
                        Informe seu e-mail para solicitar um código
                        temporário de recuperação.
                    </p>

                    {error && <div className="error" role="alert">{error}</div>}

                    <button className="primary full" disabled={busy}>
                        {busy ? "Solicitando..." : "Solicitar código"}
                    </button>
                </form>
            )}

            {step === "reset" && (
                <form onSubmit={resetPassword}>
                    {message && (
                        <p className="recovery-success">{message}</p>
                    )}

                    <p className="recovery-hint">
                        No ambiente de demonstração, consulte o código
                        no terminal do Backend. Ele vale por 15 minutos.
                    </p>

                    <label>
                        Código de recuperação
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            pattern="[0-9]{6}"
                            value={code}
                            onChange={e => setCode(
                                e.target.value.replace(/\D/g, "")
                            )}
                            placeholder="000000"
                            required
                        />
                    </label>

                    <label>
                        Nova senha
                        <input
                            type="password"
                            minLength={8}
                            maxLength={200}
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Confirmar nova senha
                        <input
                            type="password"
                            minLength={8}
                            maxLength={200}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>

                    {error && <div className="error" role="alert">{error}</div>}

                    <button className="primary full" disabled={busy}>
                        {busy ? "Redefinindo..." : "Redefinir senha"}
                    </button>

                    <button
                        type="button"
                        className="recovery-link"
                        onClick={() => {
                            setStep("request");
                            setError("");
                            setMessage("");
                            setCode("");
                        }}
                    >
                        Solicitar outro código
                    </button>
                </form>
            )}

            {step === "success" && (
                <div className="recovery-result">
                    <p className="recovery-success" role="status">
                        {message}
                    </p>
                    <button
                        type="button"
                        className="primary full"
                        onClick={onBack}
                    >
                        Voltar ao login
                    </button>
                </div>
            )}

            {step !== "success" && (
                <button
                    type="button"
                    className="recovery-link"
                    onClick={onBack}
                >
                    Voltar ao login
                </button>
            )}
        </div>
    );
}

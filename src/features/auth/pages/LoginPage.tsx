import { useState, type FormEvent } from "react";
import type { LoginHandler, ResetPasswordHandler } from "../types/auth";
import styles from "./LoginPage.module.css";

type AuthView = "login" | "forgot-password";

interface LoginPageProps {
  onLogin?: LoginHandler;
  onResetPassword?: ResetPasswordHandler;
}

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//TODO: REMOVE_THIS
const DUMMY_EMAIL = "quangduy377";
const DUMMY_PASSWORD = "1";


export default function LoginPage({
  onLogin,
  onResetPassword,
}: LoginPageProps) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isLoginView = view === "login";

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (isLoginView && !password) {
      nextErrors.password = "Password is required.";
    } else if (isLoginView && password.length < 6) {
      nextErrors.password = "Password must contain at least 6 characters.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");

    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      if (isLoginView) {
        await onLogin?.({ email: email.trim(), password });
        setSuccessMessage(
          onLogin
            ? "Signed in successfully."
            : "Login form is valid and ready to connect to an authentication API.",
        );
      } else {
        await onResetPassword?.(email.trim());
        setSuccessMessage(
          "If an account exists for this email, reset instructions will be sent shortly.",
        );
      }
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeView(nextView: AuthView) {
    setView(nextView);
    setErrors({});
    setSuccessMessage("");
    setPassword("");
    setShowPassword(false);
  }

  return (
    <main className={styles.page}>
      <section className={styles.brandPanel} aria-label="AquaHub introduction">
        <div className={styles.brandContent}>
          <span className={styles.logoMark} aria-hidden="true">A</span>
          <p className={styles.eyebrow}>AquaHub</p>
          <h1>Healthy tanks start with better tracking.</h1>
          <p className={styles.brandCopy}>
            Keep aquarium details and water parameters organized in one place.
          </p>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.heading}>
            <span className={styles.mobileBrand}>AquaHub</span>
            <h2>{isLoginView ? "Welcome back" : "Reset your password"}</h2>
            <p>
              {isLoginView
                ? "Sign in to continue to your aquarium dashboard."
                : "Enter your email and we will send you reset instructions."}
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.field}>
              <span>Email address</span>
              <input
                className={errors.email ? styles.invalidInput : undefined}
                type="email"
                name="email"
                value={email}
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((current) => ({ ...current, email: undefined, form: undefined }));
                }}
              />
              {errors.email && <small id="email-error" className={styles.error}>{errors.email}</small>}
            </label>

            {isLoginView && (
              <label className={styles.field}>
                <span>Password</span>
                <div className={styles.passwordControl}>
                  <input
                    className={errors.password ? styles.invalidInput : undefined}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setErrors((current) => ({ ...current, password: undefined, form: undefined }));
                    }}
                  />
                  <button
                    className={styles.passwordToggle}
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <small id="password-error" className={styles.error}>{errors.password}</small>}
              </label>
            )}

            {isLoginView && (
              <button
                className={styles.textButton}
                type="button"
                onClick={() => changeView("forgot-password")}
              >
                Forgot password?
              </button>
            )}

            {errors.form && <p className={styles.formError} role="alert">{errors.form}</p>}
            {successMessage && <p className={styles.success} role="status">{successMessage}</p>}

            <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Please wait..."
                : isLoginView
                  ? "Sign in"
                  : "Send reset instructions"}
            </button>

            {!isLoginView && (
              <button
                className={styles.backButton}
                type="button"
                onClick={() => changeView("login")}
              >
                Back to sign in
              </button>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

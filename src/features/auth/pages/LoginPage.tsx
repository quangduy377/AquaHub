import { useState, type FormEvent } from "react";
import styles from "./LoginPage.module.css";
import CustomButton from "../../../common/CustomButton/CustomButton";
import { login, resetPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/AquaRoutes";

const LOGIN_VIEW = "LOGIN_VIEW";
const FORGET_PASSWORD_VIEW = "FORGOT_PASSWORD_VIEW";

type AuthView = typeof LOGIN_VIEW | typeof FORGET_PASSWORD_VIEW;
interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EmailRequiredMsg:string = "Email is required.";
const EnterValidEmailMsg:string = "Enter a valid email address.";
const PasswordRequiredMsg:string = "Password is required.";
const PasswordAtleast6CharsMsg:string = "Password must contain at least 6 characters.";
const SignInSuccessfulMsg:string = "Signed in successfully.";
const ResetInstructionMsg:string = "If an account exists for this email, reset instructions will be sent shortly.";
const KeepAquariumDetailsAndWaterParameterMsg:string = "Keep aquarium details and water parameters organized in one place.";
const AquaHub:string = "AquaHub";
const HealthyTankTrackingMsg:string = "Healthy tanks start with better tracking.";
const A:string = "A";
const WelComeMsg:string = "Welcome back";
const ResetPassword:string = "Reset your password";
const SignInToContinueAquaDashboard:string = "Sign in to continue to your aquarium dashboard.";
const EnterEmailToGetResetInstruction:string = "Enter your email and we will send you reset instructions.";
const EmailAddress:string = "Email address";
const Password:string = "Password";
const PleaseWait:string = "Please wait...";
const SingIn:string = "Sign in";
const SendResetInstruction:string = "Send reset instructions";
const BackToSignIn:string = "Back to sign in";

export default function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>(LOGIN_VIEW);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loginError, setLoginError] = useState<string | null >(null);
                 
  const isLoginView = view === LOGIN_VIEW;
  const btnMsgAfterLoading:string = isLoginView ? SingIn : SendResetInstruction;
  
  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = EmailRequiredMsg;
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = EnterValidEmailMsg;
    }
    if (isLoginView && !password) {
      nextErrors.password = PasswordRequiredMsg;
    } else if (isLoginView && password.length < 6) {
      nextErrors.password = PasswordAtleast6CharsMsg;
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    setSuccessMessage("");

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (isLoginView) {
      try{
        await login({
          email: email.trim(),
          password,
        });
        setSuccessMessage(SignInSuccessfulMsg);
        navigate(ROUTES.AQUARIUMS, { replace: true });
      }
      catch(ex){
        if(ex instanceof Error){
          setLoginError(ex.message);
        }
        else{
          setLoginError("unidentify error happened");
        }
      }
    }
    else{
      const successful = await resetPassword(email.trim());
      if (successful) {
        setSuccessMessage(ResetInstructionMsg);
      }
    }
    setIsSubmitting(false);
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
          <span className={styles.logoMark} aria-hidden="true">{A}</span>
          <p className={styles.eyebrow}>{AquaHub}</p>
          <h1>{HealthyTankTrackingMsg}</h1>
          <p className={styles.brandCopy}>
            {KeepAquariumDetailsAndWaterParameterMsg}
          </p>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.heading}>
            <span className={styles.mobileBrand}>AquaHub</span>
            <h2>{isLoginView ? WelComeMsg : ResetPassword}</h2>
            <p>
              {isLoginView ? SignInToContinueAquaDashboard 
                          : EnterEmailToGetResetInstruction}
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.field}>
              <span>{EmailAddress}</span>
              <input
                className={errors.email ? styles.invalidInput : undefined}
                type="email"
                name="email"
                value={email}
                autoComplete="email"
                placeholder="example@gmail.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    email: undefined,
                  }));
                }}
              />
              {errors.email && <small id="email-error" className={styles.error}>{errors.email}</small>}
            </label>

            {isLoginView && (
              <label className={styles.field}>
                <span>{Password}</span>
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
                onClick={() => changeView(FORGET_PASSWORD_VIEW)}
              >
                Forgot password?
              </button>
            )}
            
            {successMessage && <p className={styles.success} role="status">{successMessage}</p>}
            {loginError && <p className={styles.failed} role="status">{loginError}</p>}

            <CustomButton isLoading={isSubmitting}
                          loadingMsg={PleaseWait}
                          finishedLoadingMsg={btnMsgAfterLoading}/>

            {!isLoginView && (
              <button
                className={styles.backButton}
                type="button"
                onClick={() => changeView(LOGIN_VIEW)}>
                {BackToSignIn}
              </button>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

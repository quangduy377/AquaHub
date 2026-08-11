import {type InputHTMLAttributes, forwardRef} from "react";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isEmpty?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ isEmpty, className, ...props }, ref) {
    const inputClassName = [styles.input, isEmpty ? styles.invalid : "", className]
      .filter(Boolean)
      .join(" ");
    return (
      <input
        className={inputClassName}
        ref={ref}
        {...props}
      />
    );
  },
);

export default Input;

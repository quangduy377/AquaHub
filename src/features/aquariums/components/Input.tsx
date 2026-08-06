import {type InputHTMLAttributes, forwardRef} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isEmpty?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ isEmpty, ...props }, ref) {
    return (
      <input
        className={isEmpty ? "missing-value" : undefined}
        ref={ref}
        {...props}
      />
    );
  },
);

export default Input;
"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { Field, controlClasses } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ disabled = false }: { disabled?: boolean }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-(--shadow-card) ring-1 ring-ink-100"
    >
      <Field id="username" label="Login">
        {(props) => (
          <input
            {...props}
            name="username"
            type="text"
            autoComplete="username"
            required
            disabled={disabled}
            className={`${controlClasses} h-12`}
          />
        )}
      </Field>

      <Field id="password" label="Parol">
        {(props) => (
          <input
            {...props}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={disabled}
            className={`${controlClasses} h-12`}
          />
        )}
      </Field>

      {state.error ? (
        <p
          role="alert"
          className="rounded-control bg-danger-50 px-4 py-3 text-sm text-danger-700"
        >
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={disabled || pending}
        className="w-full"
      >
        {pending ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            Kirilmoqda...
          </>
        ) : (
          <>
            <LogIn className="size-5" aria-hidden="true" />
            Kirish
          </>
        )}
      </Button>
    </form>
  );
}

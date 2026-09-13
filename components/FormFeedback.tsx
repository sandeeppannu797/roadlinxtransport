'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync, useFormStatus } from 'react-dom';
import type { FormState } from '@/lib/formState';

/* Submit, error and success UI shared by the quote and contact forms. */

/**
 * Tracks whether the success panel is showing in place of the form. Every
 * submission returns a fresh state object, so a dismissed success is
 * remembered by identity and the next success shows the panel again.
 */
export function useSuccessPanel(state: FormState) {
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const showSuccess = Boolean(state.success) && state !== dismissed;

  function sendAnother() {
    flushSync(() => setDismissed(state));
    formRef.current?.querySelector<HTMLElement>('input, select, textarea')?.focus();
  }

  return { showSuccess, formRef, sendAnother };
}

/**
 * Must render inside the <form>. While the action runs the button reads
 * `pendingLabel` and swallows clicks (Enter in a field clicks it too), so a
 * slow send can't be submitted twice. aria-disabled rather than disabled
 * keeps focus on the button, so screen readers hear the label change.
 */
export function SubmitButton({ children, pendingLabel }: { children: ReactNode; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="btn btn-accent btn-lg btn-block"
      type="submit"
      aria-disabled={pending || undefined}
      onClick={(e) => { if (pending) e.preventDefault(); }}
    >
      {pending ? <><span className="btn-spinner" aria-hidden="true" />{pendingLabel}</> : children}
    </button>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  return (
    <div className="form-alert" role="alert">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
      <span>{children}</span>
    </div>
  );
}

interface FormSuccessProps {
  title: string;
  /** The legacy success line returned by the action. */
  message: string;
  /** The address the visitor gave, shown so they can spot a typo. */
  email?: string;
  againLabel: string;
  onAgain: () => void;
}

/**
 * Replaces the form once it sends. Focus moves to the heading, which gets a
 * screen reader to announce it and brings it into view on mobile, where the
 * shorter panel would otherwise leave the visitor scrolled past it.
 */
export function FormSuccess({ title, message, email, againLabel, onAgain }: FormSuccessProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panelRef.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  return (
    <div className="card form-success" ref={panelRef}>
      <div className="fs-ic">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
      </div>
      <h2 ref={headingRef} tabIndex={-1}>{title}</h2>
      <p className="fs-lead">{message}</p>
      <p className="fs-next">
        {email
          ? <>We&apos;ll get straight back to you at <strong className="fs-email">{email}</strong>.</>
          : <>We&apos;ll get straight back to you.</>}
        {' '}Need it sooner? Call <a href="tel:0731797072">07 3179 7072</a> — we answer the phone.
      </p>
      <div className="fs-actions">
        <button className="btn btn-ghost" type="button" onClick={onAgain}>{againLabel}</button>
      </div>
    </div>
  );
}

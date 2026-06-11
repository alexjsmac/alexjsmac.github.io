import { useState, type FormEvent } from 'react'
import { profile } from '@/data/profile'
import styles from './ContactForm.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error'

const STATUS_TEXT: Record<Exclude<Status, 'idle'>, string> = {
  sending: 'Sending…',
  sent: 'Message sent — thank you. I’ll get back to you soon.',
  mailto: 'Opening your email app with the message pre-filled…',
  error: 'Something went wrong — please try again, or reach out on a social channel below.',
}

function recipient(): string {
  const { emailUser, emailDomain } = profile.contact
  return `${emailUser}@${emailDomain}`
}

/**
 * Contact form. Submits through Formspree when an ID is configured in
 * profile.contact; until then it composes a pre-filled email in the
 * visitor's mail client. The recipient address is assembled at runtime
 * only — it never appears verbatim in the static bundle.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('_gotcha')) return // honeypot tripped — drop silently

    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    const { formspreeId } = profile.contact
    if (!formspreeId) {
      const subject = encodeURIComponent(`Website inquiry — ${name}`)
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
      window.location.href = `mailto:${recipient()}?subject=${subject}&body=${body}`
      setStatus('mailto')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!res.ok) throw new Error(`Formspree ${res.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-name" className="label-mono">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email" className="label-mono">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message" className="label-mono">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className={`${styles.input} ${styles.textarea}`}
        />
      </div>

      {/* Honeypot — humans never see or fill this */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={styles.gotcha}
      />

      <div className={styles.actions}>
        <button
          type="submit"
          className={`${styles.submit} label-mono`}
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending…' : 'Send message →'}
        </button>
        <p className={styles.status} role="status" aria-live="polite">
          {status !== 'idle' && status !== 'sending'
            ? STATUS_TEXT[status]
            : ''}
        </p>
      </div>
    </form>
  )
}

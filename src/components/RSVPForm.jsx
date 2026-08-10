import { useState } from 'react'

export default function RSVPForm() {
  const [attending, setAttending] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    guests: '1',
    meal: '',
    message: '',
  })

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!attending) return
    // In production: send to backend / Airtable / etc.
    console.log({ attending, ...form })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rsvp-success" role="status">
        <p>
          {attending === 'yes'
            ? 'Merci — nous sommes ravis de vous compter parmi nous ce jour-là.'
            : 'Nous sommes désolés de ne pas vous avoir avec nous. Merci de nous avoir répondu.'}
        </p>
        <div style={{ marginTop: 24 }}>
          <div className="gold-rule" />
        </div>
      </div>
    )
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
      {/* Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="rsvp-name">
          Votre nom complet
        </label>
        <input
          id="rsvp-name"
          name="name"
          className="form-input"
          type="text"
          placeholder="Prénom Nom"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
      </div>

      {/* Attending */}
      <div className="form-group">
        <p className="form-label">Serez-vous présent(e) ?</p>
        <div className="rsvp-options">
          <button
            type="button"
            className={`rsvp-option ${attending === 'yes' ? 'selected' : ''}`}
            onClick={() => setAttending('yes')}
            aria-pressed={attending === 'yes'}
          >
            Avec joie
          </button>
          <button
            type="button"
            className={`rsvp-option ${attending === 'no' ? 'selected' : ''}`}
            onClick={() => setAttending('no')}
            aria-pressed={attending === 'no'}
          >
            Hélas, non
          </button>
        </div>
      </div>

      {attending === 'yes' && (
        <>
          {/* Guests */}
          <div className="form-group">
            <label className="form-label" htmlFor="rsvp-guests">
              Nombre d'invités (vous inclus)
            </label>
            <select
              id="rsvp-guests"
              name="guests"
              className="form-select"
              value={form.guests}
              onChange={handleChange}
            >
              {['1', '2', '3', '4'].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Meal preference */}
          <div className="form-group">
            <label className="form-label" htmlFor="rsvp-meal">
              Préférence alimentaire
            </label>
            <select
              id="rsvp-meal"
              name="meal"
              className="form-select"
              value={form.meal}
              onChange={handleChange}
            >
              <option value="">Aucune préférence</option>
              <option value="standard">Menu standard</option>
              <option value="vegetarian">Végétarien</option>
              <option value="vegan">Végan</option>
              <option value="glutenfree">Sans gluten</option>
              <option value="kosher">Casher</option>
              <option value="halal">Halal</option>
            </select>
          </div>
        </>
      )}

      {/* Message */}
      <div className="form-group">
        <label className="form-label" htmlFor="rsvp-message">
          Un mot pour les mariés
          <span style={{ opacity: 0.5, marginLeft: 8 }}>(facultatif)</span>
        </label>
        <textarea
          id="rsvp-message"
          name="message"
          className="form-textarea"
          placeholder="Vos vœux, anecdotes, ou simplement bonjour…"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="rsvp-submit"
        disabled={!attending || !form.name}
        style={{ opacity: (!attending || !form.name) ? 0.4 : 1 }}
      >
        Confirmer ma présence
      </button>
    </form>
  )
}

import { useState } from 'react'
import { CHAMPIONS, ROLES, DAMAGE_TYPES, PLAYSTYLES, DIFFICULTIES, ROLE_COLORS, getIconUrl } from '../lib/champions'
import './ChampionForm.css'

export default function ChampionForm({ initial = {}, onSubmit, submitLabel = 'Save', loading }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    champion_key: initial.champion_key || '',
    role: initial.role || '',
    damage_type: initial.damage_type || '',
    playstyle: initial.playstyle || '',
    difficulty: initial.difficulty || '',
    notes: initial.notes || '',
  })

  const [search, setSearch] = useState(initial.name || '')
  const [showDropdown, setShowDropdown] = useState(false)

  const filtered = CHAMPIONS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8)

  const selectChampion = (champ) => {
    setForm(f => ({ ...f, name: champ.name, champion_key: champ.key }))
    setSearch(champ.name)
    setShowDropdown(false)
  }

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.champion_key || !form.role || !form.damage_type || !form.playstyle || !form.difficulty) {
      alert('Please fill out all fields before saving.')
      return
    }
    onSubmit(form)
  }

  return (
    <form className="champion-form" onSubmit={handleSubmit}>
      {/* Champion Picker */}
      <div className="form-section">
        <label className="form-label">Champion</label>
        <div className="champion-search-wrap">
          <div className="champion-search-input-row">
            {form.champion_key && (
              <img
                className="search-icon-img"
                src={getIconUrl(form.champion_key)}
                alt={form.name}
              />
            )}
            <input
              className="form-input"
              placeholder="Search champion..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setShowDropdown(true)
                if (!e.target.value) set('name', '') & set('champion_key', '')
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
          </div>
          {showDropdown && filtered.length > 0 && (
            <div className="champion-dropdown">
              {filtered.map(c => (
                <button
                  key={c.key}
                  type="button"
                  className="champion-dropdown-item"
                  onMouseDown={() => selectChampion(c)}
                >
                  <img src={getIconUrl(c.key)} alt={c.name} />
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Role */}
      <div className="form-section">
        <label className="form-label">Role</label>
        <div className="btn-group">
          {ROLES.map(r => (
            <button
              key={r}
              type="button"
              className={`select-btn ${form.role === r ? 'selected' : ''}`}
              style={form.role === r ? { borderColor: ROLE_COLORS[r], color: ROLE_COLORS[r], background: `${ROLE_COLORS[r]}18` } : {}}
              onClick={() => set('role', r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Damage Type */}
      <div className="form-section">
        <label className="form-label">Damage Type</label>
        <div className="btn-group">
          {DAMAGE_TYPES.map(d => (
            <button
              key={d}
              type="button"
              className={`select-btn ${form.damage_type === d ? 'selected' : ''}`}
              onClick={() => set('damage_type', d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Playstyle */}
      <div className="form-section">
        <label className="form-label">Playstyle</label>
        <div className="btn-group">
          {PLAYSTYLES.map(p => (
            <button
              key={p}
              type="button"
              className={`select-btn ${form.playstyle === p ? 'selected' : ''}`}
              onClick={() => set('playstyle', p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="form-section">
        <label className="form-label">Difficulty</label>
        <div className="btn-group">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              type="button"
              className={`select-btn ${form.difficulty === d ? 'selected' : ''}`}
              onClick={() => set('difficulty', d)}
            >
              {d === 'Easy' ? '★' : d === 'Medium' ? '★★' : '★★★'} {d}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="form-section">
        <label className="form-label">Notes <span className="label-hint">(optional — appears on detail page)</span></label>
        <textarea
          className="form-input form-textarea"
          placeholder="Why are you drafting this champion? Any special tips or synergies?"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          rows={3}
        />
      </div>

      <button type="submit" className="btn btn-gold" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}

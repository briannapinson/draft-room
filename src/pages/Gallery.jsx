import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getSplashUrl, getIconUrl, ROLE_COLORS, DAMAGE_COLORS } from '../lib/champions'
import './Gallery.css'

function CompStats({ champions }) {
  if (champions.length === 0) return null

  const roleCounts = {}
  const damageCounts = { AD: 0, AP: 0, Mixed: 0, Tank: 0 }

  champions.forEach(c => {
    roleCounts[c.role] = (roleCounts[c.role] || 0) + 1
    if (damageCounts[c.damage_type] !== undefined) damageCounts[c.damage_type]++
  })

  const total = champions.length
  const adPct = Math.round((damageCounts.AD / total) * 100)
  const apPct = Math.round((damageCounts.AP / total) * 100)

  // Simple balance score: penalize for duplicate roles, reward AD/AP mix
  const duplicateRoles = Object.values(roleCounts).filter(v => v > 1).length
  const balance = Math.max(0, 100 - duplicateRoles * 20 - Math.abs(adPct - apPct) / 2)

  return (
    <div className="comp-stats">
      <h3 className="stats-title">Comp Analysis</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{champions.length}/5</span>
          <span className="stat-key">Picks</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: 'var(--red)' }}>{adPct}%</span>
          <span className="stat-key">AD Damage</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: 'var(--blue)' }}>{apPct}%</span>
          <span className="stat-key">AP Damage</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: balance >= 70 ? 'var(--green)' : balance >= 40 ? 'var(--gold)' : 'var(--red)' }}>
            {Math.round(balance)}
          </span>
          <span className="stat-key">Balance Score</span>
        </div>
      </div>
      {duplicateRoles > 0 && (
        <p className="stats-warning">⚠ Duplicate roles detected — consider swapping a pick</p>
      )}
    </div>
  )
}

export default function Gallery() {
  const [champions, setChampions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchChampions = async () => {
    const { data, error } = await supabase
      .from('champions')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setChampions(data)
    setLoading(false)
  }

  useEffect(() => { fetchChampions() }, [])

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <p style={{ color: 'var(--text-dim)' }}>Loading roster...</p>
      </div>
    )
  }

  return (
    <div className="page fade-in">
      <div className="gallery-header">
        <div>
          <p className="page-title">My Roster</p>
          <p className="page-sub">{champions.length === 0 ? 'No champions drafted yet' : `${champions.length} champion${champions.length !== 1 ? 's' : ''} drafted`}</p>
        </div>
        <Link to="/create" className="btn btn-gold">+ Draft Champion</Link>
      </div>

      <CompStats champions={champions} />

      {champions.length === 0 ? (
        <div className="empty-state">
          <h3>Your roster is empty</h3>
          <p>Start drafting champions to build your team comp</p>
          <Link to="/create" className="btn btn-gold" style={{ marginTop: 16 }}>Draft your first champion</Link>
        </div>
      ) : (
        <div className="gallery-grid">
          {champions.map((champ, i) => (
            <Link
              key={champ.id}
              to={`/champion/${champ.id}`}
              className="champ-card"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="champ-card-splash">
                <img src={getSplashUrl(champ.champion_key)} alt={champ.name} />
                <div className="champ-card-overlay" />
              </div>
              <div className="champ-card-body">
                <div className="champ-card-header">
                  <img className="champ-card-icon" src={getIconUrl(champ.champion_key)} alt="" />
                  <div>
                    <h3 className="champ-card-name">{champ.name}</h3>
                    <span
                      className="tag"
                      style={{
                        background: `${ROLE_COLORS[champ.role]}22`,
                        color: ROLE_COLORS[champ.role],
                        border: `1px solid ${ROLE_COLORS[champ.role]}44`,
                      }}
                    >
                      {champ.role}
                    </span>
                  </div>
                </div>
                <div className="champ-card-tags">
                  <span className="tag" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                    {champ.damage_type}
                  </span>
                  <span className="tag" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                    {champ.playstyle}
                  </span>
                </div>
              </div>
              <div className="champ-card-actions">
                <Link
                  to={`/edit/${champ.id}`}
                  className="btn btn-outline btn-sm"
                  onClick={e => e.stopPropagation()}
                >
                  Edit
                </Link>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

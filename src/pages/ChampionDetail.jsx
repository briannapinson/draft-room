import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getSplashUrl, getIconUrl, ROLE_COLORS, DAMAGE_COLORS } from '../lib/champions'
import './ChampionDetail.css'

const DIFF_STARS = { Easy: '★', Medium: '★★', Hard: '★★★' }

export default function ChampionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [champion, setChampion] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('champions')
        .select('*')
        .eq('id', id)
        .single()
      if (error || !data) navigate('/gallery')
      else setChampion(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) {
    return <div className="page" style={{ color: 'var(--text-dim)' }}>Loading...</div>
  }

  if (!champion) return null

  return (
    <div className="detail-page fade-in">
      <div
        className="detail-splash"
        style={{ backgroundImage: `url(${getSplashUrl(champion.champion_key)})` }}
      >
        <div className="detail-splash-overlay" />
        <div className="detail-splash-content">
          <Link to="/gallery" className="back-link">← Back to Roster</Link>
          <div className="detail-title-row">
            <img className="detail-icon" src={getIconUrl(champion.champion_key)} alt={champion.name} />
            <div>
              <h1 className="detail-name">{champion.name}</h1>
              <div className="detail-tags">
                <span
                  className="tag"
                  style={{
                    background: `${ROLE_COLORS[champion.role]}33`,
                    color: ROLE_COLORS[champion.role],
                    border: `1px solid ${ROLE_COLORS[champion.role]}66`,
                  }}
                >
                  {champion.role}
                </span>
                <span
                  className="tag"
                  style={{
                    background: `${DAMAGE_COLORS[champion.damage_type]}22`,
                    color: DAMAGE_COLORS[champion.damage_type],
                    border: `1px solid ${DAMAGE_COLORS[champion.damage_type]}44`,
                  }}
                >
                  {champion.damage_type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body page">
        <div className="detail-grid">
          <div className="detail-main">
            <div className="detail-card">
              <h3 className="detail-card-label">Playstyle</h3>
              <p className="detail-card-value">{champion.playstyle}</p>
            </div>
            <div className="detail-card">
              <h3 className="detail-card-label">Difficulty</h3>
              <p className="detail-card-value">
                <span style={{ color: 'var(--gold)', marginRight: 8 }}>{DIFF_STARS[champion.difficulty]}</span>
                {champion.difficulty}
              </p>
            </div>
            <div className="detail-card">
              <h3 className="detail-card-label">Drafted</h3>
              <p className="detail-card-value">
                {new Date(champion.created_at).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="detail-notes-section">
            <h3 className="detail-card-label">Notes</h3>
            {champion.notes ? (
              <p className="detail-notes-text">{champion.notes}</p>
            ) : (
              <p className="detail-notes-empty">No notes added for this champion.</p>
            )}
          </div>
        </div>

        <div className="detail-actions">
          <Link to={`/edit/${champion.id}`} className="btn btn-gold">
            Edit Champion
          </Link>
          <Link to="/gallery" className="btn btn-outline">
            Back to Roster
          </Link>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ChampionForm from '../components/ChampionForm'
import { getIconUrl } from '../lib/champions'

export default function EditChampion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [champion, setChampion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

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

  const handleUpdate = async (form) => {
    setSaving(true)
    setError(null)
    const { error } = await supabase
      .from('champions')
      .update(form)
      .eq('id', id)
    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      navigate(`/champion/${id}`)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Remove ${champion.name} from your roster?`)) return
    setDeleting(true)
    const { error } = await supabase.from('champions').delete().eq('id', id)
    setDeleting(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/gallery')
    }
  }

  if (loading) {
    return <div className="page" style={{ color: 'var(--text-dim)' }}>Loading...</div>
  }

  if (!champion) return null

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        {champion.champion_key && (
          <img
            src={getIconUrl(champion.champion_key)}
            alt={champion.name}
            style={{ width: 52, height: 52, borderRadius: 8, border: '2px solid var(--border-bright)' }}
          />
        )}
        <div>
          <p className="page-title" style={{ marginBottom: 0 }}>Edit {champion.name}</p>
        </div>
      </div>
      <p className="page-sub">Update this champion's attributes</p>

      <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        <Link to={`/champion/${id}`} className="btn btn-outline btn-sm">← Back to Detail</Link>
      </div>

      {error && (
        <div style={{ color: 'var(--red)', marginBottom: 24, padding: '12px 16px', background: '#2a1010', borderRadius: 6, border: '1px solid #5a2020' }}>
          Error: {error}
        </div>
      )}

      <ChampionForm
        initial={champion}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
        loading={saving}
      />

      <hr className="divider" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Removing this champion will permanently delete them from your roster.
        </p>
        <button
          className="btn btn-danger"
          style={{ alignSelf: 'flex-start' }}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Removing...' : `Remove ${champion.name} from Roster`}
        </button>
      </div>
    </div>
  )
}

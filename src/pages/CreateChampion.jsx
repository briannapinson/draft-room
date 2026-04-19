import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ChampionForm from '../components/ChampionForm'

export default function CreateChampion() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (form) => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.from('champions').insert([form])
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/gallery')
    }
  }

  return (
    <div className="page fade-in">
      <p className="page-title">Draft Champion</p>
      <p className="page-sub">Add a new champion to your roster</p>
      {error && (
        <div style={{ color: 'var(--red)', marginBottom: 24, padding: '12px 16px', background: '#2a1010', borderRadius: 6, border: '1px solid #5a2020' }}>
          Error: {error}
        </div>
      )}
      <ChampionForm onSubmit={handleSubmit} submitLabel="Draft Champion" loading={loading} />
    </div>
  )
}

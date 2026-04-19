import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <div className="home-bg" />
      <div className="home-content fade-in">
        <p className="home-eyebrow">League of Legends</p>
        <h1 className="home-title">BUILD THE<br />PERFECT COMP</h1>
        <p className="home-desc">
          Assemble your five-man roster, assign roles, and build the ultimate team composition. 
        </p>
        <div className="home-actions">
          <Link to="/create" className="btn btn-gold">
            Draft Champions
          </Link>
          <Link to="/gallery" className="btn btn-outline">
            View Roster
          </Link>
        </div>

        <div className="home-stats">
          <div className="home-stat">
            <span className="stat-num">5</span>
            <span className="stat-label">Roles</span>
          </div>
          <div className="stat-divider" />
          <div className="home-stat">
            <span className="stat-num">160+</span>
            <span className="stat-label">Champions</span>
          </div>
          <div className="stat-divider" />
          <div className="home-stat">
            <span className="stat-num">∞</span>
            <span className="stat-label">Comps</span>
          </div>
        </div>
      </div>
    </div>
  )
}

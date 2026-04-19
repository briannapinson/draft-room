import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">⚔</span>
        DRAFT ROOM
      </Link>
      <div className="navbar-links">
        <Link to="/gallery" className={`nav-link ${pathname === '/gallery' ? 'active' : ''}`}>
          My Roster
        </Link>
        <Link to="/create" className="btn btn-gold btn-sm">
          + Add Champion
        </Link>
      </div>
    </nav>
  )
}

import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <p>© {new Date().getFullYear()} Pankaj Baid</p>
        <p>Hand-built with React and Vite: no UI library, self-hosted fonts, no trackers. <a href={profile.repo} target="_blank" rel="noopener noreferrer">Source</a></p>
      </div>
    </footer>
  )
}

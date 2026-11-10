const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
export const Icon = ({ d, size, children, ...p }) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...p}>{children || <path d={d} />}</svg>
)
export const ArrowUpRight = (p) => <Icon {...p} d="M7 17 17 7M8 7h9v9" />
export const ArrowRight = (p) => <Icon {...p} d="M5 12h14M13 6l6 6-6 6" />
export const Download = (p) => <Icon {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></Icon>
export const Copy = (p) => <Icon {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></Icon>
export const Check = (p) => <Icon {...p} d="M5 12.5 10 17.5 19 7" />
export const Sun = (p) => <Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Icon>
export const Moon = (p) => <Icon {...p} d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
export const Search = (p) => <Icon {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></Icon>
export const Github = (p) => <Icon {...p}><path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.8-2.3c2.8-.3 5.8-1.4 5.8-6.2a4.8 4.8 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.3s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.1 5.4 2.4 5.4 2.4a4.4 4.4 0 0 0-.1 3.3A4.8 4.8 0 0 0 4 9c0 4.8 3 5.9 5.8 6.2A3 3 0 0 0 9 17.5V21" /></Icon>
export const Linkedin = (p) => <Icon {...p}><path d="M6.5 9.5v9M6.5 5.5v.01M11 18.5v-9M11 13c0-2 1.3-3.5 3.3-3.5s3.2 1.4 3.2 3.6v5.4" /><rect x="3" y="3" width="18" height="18" rx="3" /></Icon>
export const Mail = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></Icon>
export const Code = (p) => <Icon {...p} d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
export const Menu = (p) => <Icon {...p} d="M4 7h16M4 12h16M4 17h16" />
export const Close = (p) => <Icon {...p} d="M6 6l12 12M18 6 6 18" />
export const Command = (p) => <Icon {...p} d="M9 9h6v6H9zM9 9V6.5A2.5 2.5 0 1 0 6.5 9H9Zm6 0V6.5A2.5 2.5 0 1 1 17.5 9H15Zm-6 6v2.5A2.5 2.5 0 1 1 6.5 15H9Zm6 0v2.5a2.5 2.5 0 1 0 2.5-2.5H15Z" />
export const Star = (p) => <Icon {...p} d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
export const Pulse = (p) => <Icon {...p} d="M3 12h4l2.5-6 4 12 2.5-6H21" />

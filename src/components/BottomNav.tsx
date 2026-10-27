import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Beranda', icon: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' },
  { to: '/salat', label: 'Salat', icon: 'M12 3a5 5 0 0 0-5 5v3h10V8a5 5 0 0 0-5-5zM5 11h14v10H5zM10 15h4v6h-4z' },
  { to: '/zakat', label: 'Zakat', icon: 'M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z' },
  { to: '/puasa', label: 'Puasa', icon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z' },
  { to: '/haji', label: 'Haji', icon: 'M4 8l8-4 8 4v12H4zM4 12h16' },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} end={it.to === '/'} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d={it.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

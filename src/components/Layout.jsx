import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { IoReturnUpBackOutline } from 'react-icons/io5'

function getParentPath(pathname) {
  // Detail pages → list page
  if (/^\/definitions\/[^/]+$/.test(pathname)) return '/definitions'
  if (/^\/agitators\/[^/]+$/.test(pathname)) return '/agitators'
  if (/^\/misconceptions\/[^/]+$/.test(pathname)) return '/misconceptions'
  if (/^\/conspiracies\/[^/]+$/.test(pathname)) return '/conspiracies'
  // List/top-level sections → hub
  if (/^\/(definitions|agitators|misconceptions|conspiracies|timeline|stylesheet)$/.test(pathname)) return '/explore'
  // Hub → landing
  if (pathname === '/explore') return '/'
  return '/explore'
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const isExplore = pathname === '/explore'
  const parentPath = getParentPath(pathname)
  const isAtTop = pathname === '/explore'

  return (
    <div className={`layout ${isExplore ? 'layout--explore' : ''}`}>
      <button
        type="button"
        className="layout-back"
        onClick={() => navigate(parentPath)}
        aria-label={isAtTop ? 'Go to home' : 'Go back'}
      >
        <IoReturnUpBackOutline aria-hidden />
      </button>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  )
}

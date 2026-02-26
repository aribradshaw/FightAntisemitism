import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { IoReturnUpBackOutline } from 'react-icons/io5'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isExplore = location.pathname === '/explore'

  return (
    <div className={`layout ${isExplore ? 'layout--explore' : ''}`}>
      <button
        type="button"
        className="layout-back"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <IoReturnUpBackOutline aria-hidden />
      </button>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  )
}

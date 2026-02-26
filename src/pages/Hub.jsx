import { Link } from 'react-router-dom'
import { TbTimelineEventExclamation } from 'react-icons/tb'
import { CiTextAlignLeft } from 'react-icons/ci'
import { PiSmileyAngryBold } from 'react-icons/pi'
import { FaQuestionCircle } from 'react-icons/fa'

const modules = [
  { to: '/timeline', title: 'Timeline', Icon: TbTimelineEventExclamation },
  { to: '/definitions', title: 'Definitions', Icon: CiTextAlignLeft },
  { to: '/agitators', title: 'Agitators', Icon: PiSmileyAngryBold },
  { to: '/misconceptions', title: 'Misconceptions', Icon: FaQuestionCircle },
]

export default function Hub() {
  return (
    <div className="hub">
      <h1 className="hub-title">Explore</h1>
      <div className="hub-grid">
        {modules.map((m) => (
          <Link key={m.to} to={m.to} className="hub-card">
            <span className="hub-card-icon">
              <m.Icon aria-hidden />
            </span>
            <h2 className="hub-card-title">{m.title}</h2>
          </Link>
        ))}
        <Link to="/slideshow" className="hub-slideshow-button">
          Slideshow
        </Link>
      </div>
    </div>
  )
}

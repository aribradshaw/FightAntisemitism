import { useState, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { kml as kmlToGeoJSON } from '@tmcw/togeojson'
import JSZip from 'jszip'
import 'leaflet/dist/leaflet.css'
import { getMapLayerForYear } from '../data/bibleGeocoding'

const MAP_CENTER = [32, 35]
const MAP_ZOOM = 6

function parseKMLString(text) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/xml')
  return kmlToGeoJSON(doc)
}

async function loadFromUrl(url, name) {
  const isKmz = /\.kmz$/i.test(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
  if (isKmz) {
    const buf = await res.arrayBuffer()
    const zip = await JSZip.loadAsync(buf)
    const kmlEntry = Object.keys(zip.files).find((f) => f.toLowerCase().endsWith('.kml'))
    if (!kmlEntry) throw new Error('No .kml inside KMZ')
    const text = await zip.files[kmlEntry].async('string')
    return { name, geojson: parseKMLString(text) }
  }
  const text = await res.text()
  return { name, geojson: parseKMLString(text) }
}

function popupContent(feature) {
  const p = feature?.properties || {}
  const name = p.name || p.Name || p.place || p.title || ''
  if (name) return `<strong>${escapeHtml(String(name))}</strong>`
  return '<span>Place</span>'
}

function escapeHtml(s) {
  const div = document.createElement('div')
  div.textContent = s
  return div.innerHTML
}

function onEachFeature(feature, layer) {
  layer.bindPopup(popupContent(feature), {
    maxWidth: 320,
    className: 'timeline-map-popup',
  })
  layer.on({ mouseover: () => layer.setStyle({ weight: 4 }), mouseout: () => layer.setStyle({ weight: 2 }) })
}

function GeoJSONOverlay({ layer }) {
  if (!layer?.geojson) return null
  return (
    <GeoJSON
      key={layer.id}
      data={layer.geojson}
      style={{
        color: '#2563eb',
        weight: 2,
        fillColor: '#2563eb',
        fillOpacity: 0.15,
      }}
      onEachFeature={onEachFeature}
    />
  )
}

export default function TimelineMap({ currentYear }) {
  const [layer, setLayer] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadItem = useCallback(async (item) => {
    setError(null)
    setLoading(true)
    try {
      const { name, url } = item
      const { geojson } = await loadFromUrl(url, name)
      const hasFeatures =
        (geojson?.features && geojson.features.length > 0) || geojson?.geometry
      if (!hasFeatures) {
        setError(`No features in ${name}.`)
        return
      }
      const fc =
        geojson.type === 'FeatureCollection'
          ? geojson
          : { type: 'FeatureCollection', features: [geojson] }
      setLayer({ id: item.id, name, geojson: fc })
    } catch (err) {
      setError(err.message || 'Failed to load.')
    } finally {
      setLoading(false)
    }
  }, [])

  // When timeline year changes, show Bible book for that year or Israel (1948+); clear layer for years with no match
  useEffect(() => {
    const y = currentYear != null ? Number(currentYear) : null
    if (y == null || Number.isNaN(y)) return
    const layerItem = getMapLayerForYear(y)
    if (layerItem) {
      loadItem(layerItem)
    } else {
      setLayer(null)
    }
  }, [currentYear, loadItem])

  return (
    <div className="timeline-map-wrap">
      {error && <p className="timeline-map-error">{error}</p>}
      <div className="timeline-map-container">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          className="timeline-map-leaflet"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {layer && <GeoJSONOverlay layer={layer} />}
        </MapContainer>
      </div>
    </div>
  )
}

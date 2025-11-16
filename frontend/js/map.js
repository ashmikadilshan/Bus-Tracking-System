function createMap(containerId){
  // Initialize map with Colombo as default center
  const map = L.map(containerId).setView([6.9271, 79.8612], 13)
  
  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
  
  // Store markers for buses
  const markers = {}
  const routes = {}
  
  // Create route polyline
  function drawRoute(routeId, waypoints) {
    if (!waypoints || waypoints.length === 0) return
    
    // Remove existing route if present
    if (routes[routeId]) {
      map.removeLayer(routes[routeId])
    }
    
    // Parse waypoints if string
    let points = waypoints
    if (typeof waypoints === 'string') {
      try {
        points = JSON.parse(waypoints)
      } catch (e) {
        console.error('Failed to parse waypoints', e)
        return
      }
    }
    
    // Create polyline
    const latlngs = points.map(p => [p.lat, p.lng])
    routes[routeId] = L.polyline(latlngs, {
      color: '#667eea',
      weight: 3,
      opacity: 0.7,
      dashArray: '5, 10'
    }).addTo(map)
  }
  
  // Update or create bus marker
  function updateBus(id, lat, lng, status = 'running') {
    if (!lat || !lng) return
    
    const busIcon = L.divIcon({
      html: `<div style="
        background: ${status === 'running' ? '#667eea' : '#999'};
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      ">🚌</div>`,
      iconSize: [30, 30],
      className: 'bus-marker'
    })
    
    if (!markers[id]) {
      markers[id] = L.marker([lat, lng], { icon: busIcon })
        .addTo(map)
        .bindPopup(`<strong>Bus #${id}</strong><br>Status: ${status}<br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}`, {
          className: 'bus-popup'
        })
    } else {
      markers[id].setLatLng([lat, lng])
      markers[id].setIcon(busIcon)
    }
  }
  
  // Focus on specific bus
  function focusBus(id) {
    if (markers[id]) {
      const latLng = markers[id].getLatLng()
      map.setView(latLng, 16)
      markers[id].openPopup()
    }
  }
  
  // Get all markers
  function getMarkers() {
    return markers
  }
  
  // Clear all markers
  function clearMarkers() {
    Object.values(markers).forEach(marker => map.removeLayer(marker))
    Object.keys(markers).forEach(key => delete markers[key])
  }
  
  // Add marker for locations (stops, landmarks)
  function addLocationMarker(lat, lng, label, icon = '📍') {
    return L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<strong>${label}</strong><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}`)
  }
  
  // Fit map bounds
  function fitBounds() {
    const group = new L.featureGroup(Object.values(markers))
    if (group.getLayers().length > 0) {
      map.fitBounds(group.getBounds().pad(0.1))
    }
  }
  
  return {
    map,
    updateBus,
    focusBus,
    drawRoute,
    getMarkers,
    clearMarkers,
    addLocationMarker,
    fitBounds
  }
}


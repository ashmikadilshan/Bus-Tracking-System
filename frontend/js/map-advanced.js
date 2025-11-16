// Advanced Map Functions for Professional Dashboard

function createMap(containerId) {
  // Initialize map with Colombo as default center
  const map = L.map(containerId).setView([6.9271, 79.8612], 13);
  
  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
    className: 'map-tiles'
  }).addTo(map);

  // Add alternate tile layers for variety
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles © Esri'
  });

  const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© CartoDB'
  });

  // Control layer
  const layerControl = L.control.layers(
    {
      'Street': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      'Satellite': satelliteLayer,
      'Dark': darkLayer
    }
  );
  layerControl.addTo(map);

  // Store data
  const markers = {};
  const routes = {};
  const routeLines = {};
  const heatmapData = [];

  // Custom icons
  const busIconRunning = L.divIcon({
    html: `<div style="
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
      animation: pulse 2s infinite;
    ">🚌</div>
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    </style>`,
    iconSize: [35, 35],
    className: 'bus-marker-running'
  });

  const busIconIdle = L.divIcon({
    html: `<div style="
      background: #95a5a6;
      color: white;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
    ">🚌</div>`,
    iconSize: [35, 35],
    className: 'bus-marker-idle'
  });

  const busIconMaintenance = L.divIcon({
    html: `<div style="
      background: #f39c12;
      color: white;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
    ">⚙️</div>`,
    iconSize: [35, 35],
    className: 'bus-marker-maintenance'
  });

  const stopIcon = L.divIcon({
    html: `<div style="
      background: #2ecc71;
      color: white;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">📍</div>`,
    iconSize: [25, 25],
    className: 'stop-marker'
  });

  // Get appropriate bus icon
  function getBusIcon(status) {
    switch (status) {
      case 'running':
        return busIconRunning;
      case 'idle':
        return busIconIdle;
      case 'maintenance':
        return busIconMaintenance;
      default:
        return busIconIdle;
    }
  }

  // Update or create bus marker
  function updateBus(id, lat, lng, status = 'running', speed = 0) {
    if (!lat || !lng) return;

    const icon = getBusIcon(status);

    if (!markers[id]) {
      markers[id] = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: Arial; width: 250px;">
            <strong style="font-size: 1.1em; color: #667eea;">🚌 Bus #${id}</strong><br>
            <hr style="margin: 5px 0;">
            <table style="width: 100%; font-size: 0.9em;">
              <tr><td><strong>Status:</strong></td><td><span style="color: ${status === 'running' ? '#2ecc71' : status === 'idle' ? '#95a5a6' : '#f39c12'};">${status.toUpperCase()}</span></td></tr>
              <tr><td><strong>Speed:</strong></td><td>${speed.toFixed(1)} km/h</td></tr>
              <tr><td><strong>Latitude:</strong></td><td>${lat.toFixed(5)}</td></tr>
              <tr><td><strong>Longitude:</strong></td><td>${lng.toFixed(5)}</td></tr>
            </table>
          </div>
        `, {
          maxWidth: 300,
          className: 'bus-popup'
        });
      markers[id].busData = { id, status, speed };
    } else {
      markers[id].setLatLng([lat, lng]);
      markers[id].setIcon(icon);
      markers[id].busData = { id, status, speed };
    }

    // Add to heatmap data
    heatmapData.push([lat, lng, 0.5]);
  }

  // Draw route on map
  function drawRoute(routeId, waypoints, options = {}) {
    if (!waypoints || waypoints.length === 0) return;

    // Remove existing route if present
    if (routeLines[routeId]) {
      map.removeLayer(routeLines[routeId]);
    }

    // Parse waypoints if string
    let points = waypoints;
    if (typeof waypoints === 'string') {
      try {
        points = JSON.parse(waypoints);
      } catch (e) {
        console.error('Failed to parse waypoints', e);
        return;
      }
    }

    // Create polyline
    const latlngs = points.map(p => [p.lat, p.lng]);
    const color = options.color || '#667eea';
    
    routeLines[routeId] = L.polyline(latlngs, {
      color: color,
      weight: 3,
      opacity: 0.7,
      dashArray: '5, 10',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Add stop markers
    points.forEach((point, index) => {
      L.marker([point.lat, point.lng], { icon: stopIcon })
        .addTo(map)
        .bindPopup(`<strong>${point.name || `Stop ${index + 1}`}</strong>`);
    });

    routes[routeId] = routeLines[routeId];
  }

  // Focus on specific bus
  function focusBus(id) {
    if (markers[id]) {
      const latLng = markers[id].getLatLng();
      map.setView(latLng, 16);
      markers[id].openPopup();
    }
  }

  // Get all markers
  function getMarkers() {
    return markers;
  }

  // Clear all markers
  function clearMarkers() {
    Object.values(markers).forEach(marker => map.removeLayer(marker));
    Object.keys(markers).forEach(key => delete markers[key]);
  }

  // Add location marker (for stops, landmarks)
  function addLocationMarker(lat, lng, label, icon = '📍', popupContent = null) {
    const customIcon = L.divIcon({
      html: `<div style="
        font-size: 24px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${icon}</div>`,
      iconSize: [30, 30],
      className: 'location-marker'
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    
    if (popupContent) {
      marker.bindPopup(popupContent);
    } else {
      marker.bindPopup(`<strong>${label}</strong><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}`);
    }

    return marker;
  }

  // Fit map bounds to all markers
  function fitBounds() {
    const group = new L.featureGroup(Object.values(markers));
    if (group.getLayers().length > 0) {
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  // Add heat layer
  function addHeatLayer() {
    if (window.L && window.L.heatLayer && heatmapData.length > 0) {
      L.heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1.0,
        gradient: {0.4: 'blue', 0.65: 'lime', 0.8: 'yellow', 1.0: 'red'}
      }).addTo(map);
    }
  }

  // Draw circle for coverage area
  function drawCoverageArea(lat, lng, radius, options = {}) {
    const circle = L.circle([lat, lng], {
      radius: radius * 1000, // Convert km to meters
      color: options.color || '#667eea',
      fill: true,
      fillColor: options.fillColor || '#667eea',
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '5, 5'
    }).addTo(map);

    return circle;
  }

  // Search buses on map
  function searchBuses(query) {
    return Object.values(markers).filter(marker => {
      const data = marker.busData;
      return data && data.id.toString().includes(query);
    });
  }

  // Export map data
  function exportMapData() {
    return {
      markers: Object.keys(markers).map(id => {
        const marker = markers[id];
        return {
          id,
          lat: marker.getLatLng().lat,
          lng: marker.getLatLng().lng,
          data: marker.busData
        };
      }),
      routes: Object.keys(routes)
    };
  }

  // Public API
  return {
    map,
    updateBus,
    focusBus,
    drawRoute,
    getMarkers,
    clearMarkers,
    addLocationMarker,
    fitBounds,
    addHeatLayer,
    drawCoverageArea,
    searchBuses,
    exportMapData
  };
}

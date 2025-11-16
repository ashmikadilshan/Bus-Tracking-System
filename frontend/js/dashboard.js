// Professional Dashboard JavaScript

class BusTrackingDashboard {
  constructor() {
    this.currentSection = 'overview';
    this.selectedBus = null;
    this.map = null;
    this.buses = [];
    this.routes = [];
    this.drivers = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadData();
    this.setupCharts();
    this.setupSocket();
  }

  setupEventListeners() {
    // Sidebar Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchSection(item.dataset.section);
      });
    });

    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
      });
    }

    // Search
    document.getElementById('globalSearch').addEventListener('input', (e) => {
      this.performGlobalSearch(e.target.value);
    });

    document.getElementById('busSearch').addEventListener('input', (e) => {
      this.filterBuses(e.target.value);
    });

    // Filters
    document.getElementById('filterRunning').addEventListener('change', () => this.updateBusFilters());
    document.getElementById('filterIdle').addEventListener('change', () => this.updateBusFilters());
    document.getElementById('filterMaintenance').addEventListener('change', () => this.updateBusFilters());

    // Map Controls
    document.getElementById('mapZoomIn').addEventListener('click', () => {
      if (this.map) this.map.zoomIn();
    });
    document.getElementById('mapZoomOut').addEventListener('click', () => {
      if (this.map) this.map.zoomOut();
    });
    document.getElementById('mapCenter').addEventListener('click', () => {
      if (this.map) this.map.setView([6.9271, 79.8612], 13);
    });
    document.getElementById('mapFullscreen').addEventListener('click', () => {
      this.toggleMapFullscreen();
    });

    // Refresh Button
    document.getElementById('refreshBtn').addEventListener('click', () => {
      this.loadData();
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.logout();
    });

    // Modal Close
    document.querySelector('.close').addEventListener('click', () => {
      this.closeModal();
    });

    // Modal Form
    document.getElementById('busForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveBus();
    });

    // Buttons
    document.getElementById('addBusBtn').addEventListener('click', () => {
      this.openBusModal();
    });
  }

  switchSection(section) {
    // Hide current section
    const currentSection = document.getElementById(this.currentSection);
    if (currentSection) {
      currentSection.classList.remove('active');
    }

    // Show new section
    const newSection = document.getElementById(section);
    if (newSection) {
      newSection.classList.add('active');
    }

    // Update nav item active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.section === section) {
        item.classList.add('active');
      }
    });

    // Update page title
    const titles = {
      overview: 'Dashboard Overview',
      tracking: 'Live Tracking',
      routes: 'Routes Management',
      buses: 'Fleet Management',
      drivers: 'Drivers Management',
      analytics: 'Analytics',
      settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';

    this.currentSection = section;

    // Initialize map if tracking section
    if (section === 'tracking' && !this.map) {
      this.initializeMap();
    }
  }

  async loadData() {
    try {
      const api = '/api';
      
      // Load buses
      const busesRes = await fetch(`${api}/passenger/buses`);
      this.buses = await busesRes.json();
      
      // Update stats
      document.getElementById('totalBuses').textContent = this.buses.length;
      document.getElementById('activeBuses').textContent = this.buses.filter(b => b.status === 'running').length;
      
      // Load routes
      // Assuming there's an endpoint for routes
      this.routes = [
        { id: 1, name: 'Route A - Fort to Dehiwala', stops: 8, buses: 2 },
        { id: 2, name: 'Route B - Colombo to Kandy', stops: 5, buses: 1 },
        { id: 3, name: 'Route C - Airport Express', stops: 4, buses: 1 },
        { id: 4, name: 'Route D - South Loop', stops: 5, buses: 1 }
      ];
      
      document.getElementById('activeRoutes').textContent = this.routes.length;
      
      // Update UI
      this.renderBuses();
      this.renderRoutes();
      this.renderBusList();
      this.renderRoutesList();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  initializeMap() {
    const container = document.getElementById('mapContainer');
    if (!container) return;

    this.map = L.map(container).setView([6.9271, 79.8612], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Add bus markers
    this.buses.forEach(bus => {
      if (bus.current_lat && bus.current_lng) {
        this.addBusMarker(bus);
      }
    });
  }

  addBusMarker(bus) {
    if (!this.map) return;

    const statusColor = {
      'running': '#667eea',
      'idle': '#95a5a6',
      'maintenance': '#f39c12'
    };

    const color = statusColor[bus.status] || '#667eea';

    const marker = L.circleMarker([bus.current_lat, bus.current_lng], {
      radius: 10,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    });

    marker.bindPopup(`
      <div style="padding: 10px;">
        <strong>🚌 Bus ${bus.plate_number}</strong><br>
        Status: ${bus.status}<br>
        Speed: ${bus.speed || 0} km/h<br>
        Lat: ${bus.current_lat.toFixed(4)}<br>
        Lng: ${bus.current_lng.toFixed(4)}
      </div>
    `);

    marker.addTo(this.map);
    marker.on('click', () => {
      this.selectBus(bus);
    });

    bus.marker = marker;
  }

  selectBus(bus) {
    this.selectedBus = bus;
    
    // Update info panel
    const infoCard = document.getElementById('selectedBusInfo');
    infoCard.style.display = 'block';
    
    document.getElementById('infoBusPlate').textContent = bus.plate_number;
    document.getElementById('infoBusStatus').textContent = bus.status.toUpperCase();
    document.getElementById('infoBusSpeed').textContent = (bus.speed || 0) + ' km/h';
    document.getElementById('infoBusDriver').textContent = 'John Doe'; // From data
    document.getElementById('infoBusRoute').textContent = 'Route A';
    document.getElementById('infoBusPassengers').textContent = '28/50';

    // Highlight bus item
    document.querySelectorAll('.bus-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.busId == bus.id) {
        item.classList.add('active');
      }
    });

    // Center map on bus
    if (this.map) {
      this.map.setView([bus.current_lat, bus.current_lng], 15);
    }
  }

  renderBuses() {
    const container = document.getElementById('busesGrid');
    if (!container) return;

    container.innerHTML = this.buses.map(bus => `
      <div class="bus-card" onclick="dashboard.selectBus(${JSON.stringify(bus).replace(/"/g, '&quot;')})">
        <div class="bus-card-header">
          <div class="bus-card-title">🚌 ${bus.plate_number}</div>
          <span class="status-badge status-${bus.status}">${bus.status}</span>
        </div>
        <div class="bus-card-body">
          <div class="card-row">
            <span class="card-label">Capacity:</span>
            <span class="card-value">${bus.capacity || 40}</span>
          </div>
          <div class="card-row">
            <span class="card-label">Speed:</span>
            <span class="card-value">${(bus.speed || 0).toFixed(1)} km/h</span>
          </div>
          <div class="card-row">
            <span class="card-label">Location:</span>
            <span class="card-value">${(bus.current_lat || 0).toFixed(2)}, ${(bus.current_lng || 0).toFixed(2)}</span>
          </div>
        </div>
        <button class="btn-primary" style="width: 100%;">View Details</button>
      </div>
    `).join('');
  }

  renderRoutes() {
    const tbody = document.getElementById('routesTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.routes.map(route => `
      <tr>
        <td><strong>${route.name}</strong></td>
        <td>${route.stops} stops</td>
        <td>${route.buses} bus(es)</td>
        <td><span class="status-badge status-running">Active</span></td>
        <td>
          <button class="btn-small" onclick="dashboard.viewRoute(${route.id})">View</button>
        </td>
      </tr>
    `).join('');
  }

  renderBusList() {
    const container = document.getElementById('busList');
    if (!container) return;

    container.innerHTML = this.buses.map(bus => `
      <div class="bus-item" data-bus-id="${bus.id}" onclick="dashboard.selectBus(${JSON.stringify(bus).replace(/"/g, '&quot;')})">
        <strong>🚌 ${bus.plate_number}</strong><br>
        <small>${bus.status} • ${bus.speed || 0} km/h</small>
      </div>
    `).join('');
  }

  renderRoutesList() {
    const container = document.getElementById('routeList');
    if (!container) return;

    container.innerHTML = this.routes.map(route => `
      <div class="route-item" onclick="dashboard.viewRoute(${route.id})">
        <strong>${route.name}</strong><br>
        <small>${route.stops} stops</small>
      </div>
    `).join('');
  }

  updateBusFilters() {
    const running = document.getElementById('filterRunning').checked;
    const idle = document.getElementById('filterIdle').checked;
    const maintenance = document.getElementById('filterMaintenance').checked;

    const filtered = this.buses.filter(bus => {
      if (bus.status === 'running') return running;
      if (bus.status === 'idle') return idle;
      if (bus.status === 'maintenance') return maintenance;
      return false;
    });

    // Update map markers visibility
    this.buses.forEach(bus => {
      if (bus.marker) {
        const shouldShow = filtered.includes(bus);
        bus.marker.setVisible ? bus.marker.setVisible(shouldShow) : (bus.marker.opacity = shouldShow ? 1 : 0);
      }
    });
  }

  filterBuses(query) {
    const container = document.getElementById('busList');
    if (!container) return;

    const filtered = this.buses.filter(bus => 
      bus.plate_number.toLowerCase().includes(query.toLowerCase())
    );

    container.innerHTML = filtered.map(bus => `
      <div class="bus-item" data-bus-id="${bus.id}" onclick="dashboard.selectBus(${JSON.stringify(bus).replace(/"/w', '&quot;')})">
        <strong>🚌 ${bus.plate_number}</strong><br>
        <small>${bus.status} • ${bus.speed || 0} km/h</small>
      </div>
    `).join('');
  }

  performGlobalSearch(query) {
    if (!query.trim()) return;

    const results = [
      ...this.buses.filter(b => b.plate_number.toLowerCase().includes(query.toLowerCase())),
      ...this.routes.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    ];

    console.log('Search results:', results);
  }

  setupCharts() {
    // Fleet Status Chart
    const fleetCtx = document.getElementById('fleetChart');
    if (fleetCtx) {
      new Chart(fleetCtx, {
        type: 'doughnut',
        data: {
          labels: ['Running', 'Idle', 'Maintenance'],
          datasets: [{
            data: [4, 1, 1],
            backgroundColor: [
              '#2ecc71',
              '#95a5a6',
              '#f39c12'
            ],
            borderColor: '#fff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // Route Performance Chart
    const routeCtx = document.getElementById('routeChart');
    if (routeCtx) {
      new Chart(routeCtx, {
        type: 'bar',
        data: {
          labels: ['Route A', 'Route B', 'Route C', 'Route D'],
          datasets: [{
            label: 'On-time %',
            data: [92, 88, 95, 85],
            backgroundColor: '#667eea',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          indexAxis: 'x',
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }
  }

  setupSocket() {
    socketClient.on('bus_location', (data) => {
      const bus = this.buses.find(b => b.id === data.bus_id);
      if (bus) {
        bus.current_lat = data.lat;
        bus.current_lng = data.lng;
        
        if (bus.marker && this.map) {
          bus.marker.setLatLng([data.lat, data.lng]);
        }
        
        if (this.selectedBus && this.selectedBus.id === bus.id) {
          this.selectBus(bus);
        }
      }
    });

    socketClient.on('alert', (data) => {
      console.log('Alert received:', data);
      this.showNotification(data.message);
    });
  }

  toggleMapFullscreen() {
    const mapSection = document.querySelector('.map-section');
    if (mapSection) {
      mapSection.requestFullscreen();
    }
  }

  openBusModal() {
    document.getElementById('busModal').classList.add('show');
  }

  closeModal() {
    document.getElementById('busModal').classList.remove('show');
  }

  saveBus() {
    console.log('Saving bus...');
    this.closeModal();
  }

  viewRoute(routeId) {
    console.log('Viewing route:', routeId);
    this.switchSection('tracking');
  }

  showNotification(message) {
    console.log('Notification:', message);
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = '/index.html';
    }
  }
}

// Initialize dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new BusTrackingDashboard();
});

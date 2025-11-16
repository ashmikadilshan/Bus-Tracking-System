# Professional Bus Tracking Dashboard

## Overview
A comprehensive, professional-grade dashboard for managing and monitoring a fleet of buses in real-time. Built with modern web technologies and featuring an advanced interactive map system.

## Features

### 🎯 Dashboard Overview
- **Real-time Statistics**: Display total buses, active drivers, routes, and alerts
- **Fleet Status Chart**: Visual representation of bus operational status (running, idle, maintenance)
- **Route Performance Chart**: Analytics on route on-time performance
- **Recent Activity Log**: Live feed of system events and alerts

### 🗺️ Live Tracking
- **Advanced Interactive Map**: 
  - Multiple map layer support (Street, Satellite, Dark mode)
  - Real-time bus location updates via WebSocket
  - Custom animated bus markers with status indicators
  - Route visualization with stop markers
  - Heatmap visualization for traffic density
  - Coverage area circles

- **Sidebar Controls**:
  - Filter buses by status (running, idle, maintenance)
  - Search functionality for quick bus access
  - Route list with quick navigation
  - Detailed bus information panel

- **Map Controls**:
  - Zoom in/out buttons
  - Center map button
  - Fullscreen mode
  - Layer switching

### 📊 Fleet Management
- **Grid View**: Display all buses in a professional card layout
  - Plate number and status badge
  - Current capacity and speed
  - Real-time location coordinates
  - Quick action buttons

### 🛣️ Routes Management
- **Tabular View**: Manage all routes
  - Route information (name, stops, active buses)
  - Status indicators
  - Quick action buttons

### 👥 Drivers Management
- **Driver Profiles**: Manage driver information
- **Assignment Tracking**: View assigned buses
- **Status Updates**: Real-time driver status

### 📈 Analytics
- Performance metrics
- Route analytics
- Driver performance tracking
- Historical data analysis

## Technical Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Advanced styling with CSS variables and Grid/Flexbox
- **JavaScript (ES6+)**: Modern JavaScript with class-based architecture
- **Leaflet.js**: Interactive mapping library
- **Chart.js**: Data visualization
- **Socket.IO Client**: Real-time communication

### Architecture

#### CSS Structure
- **dashboard.css**: Professional styling with modern design
  - CSS custom properties for theming
  - Responsive grid layouts
  - Smooth animations and transitions
  - Dark/Light theme support

#### JavaScript Modules
1. **dashboard.js**: Main dashboard logic
   - Section management
   - Event handling
   - Data loading and rendering
   - Chart initialization

2. **map-advanced.js**: Advanced map functionality
   - Custom bus markers with status indicators
   - Route visualization
   - Heatmap support
   - Coverage area visualization
   - Bus search and filtering

3. **socket.js**: Real-time communication
   - Connection management
   - Location update handling
   - Alert notifications
   - Reconnection logic

## File Structure
```
frontend/
├── dashboard.html          # Main dashboard page
├── css/
│   ├── style.css          # Original style (passenger view)
│   └── dashboard.css      # Professional dashboard styles
├── js/
│   ├── dashboard.js       # Dashboard logic
│   ├── map.js             # Basic map functions (legacy)
│   ├── map-advanced.js    # Advanced map features
│   └── socket.js          # WebSocket client
```

## Color Scheme
- **Primary**: `#667eea` (Purple)
- **Secondary**: `#764ba2` (Dark Purple)
- **Accent**: `#f5576c` (Red)
- **Success**: `#2ecc71` (Green)
- **Warning**: `#f39c12` (Orange)
- **Danger**: `#e74c3c` (Red)
- **Background**: `#f8f9fa` (Light Gray)

## Responsive Design
- **Desktop**: Full-featured layout with sidebar
- **Tablet**: Adjusted grid layouts, collapsible sidebar
- **Mobile**: Single column layout, hidden sidebar

## Usage

### Accessing the Dashboard
1. Navigate to `/dashboard.html`
2. The page will load with the Overview section active
3. Use the sidebar navigation to switch between sections

### Real-time Updates
- Bus locations update automatically via WebSocket
- Status changes are reflected immediately
- Alerts appear in real-time

### Map Interaction
1. Click on a bus marker to view details
2. Use map controls for zoom and navigation
3. Switch map layers using the layer control
4. Search for specific buses using the search bar

## Advanced Features

### Custom Icons
- 🚌 Running buses: Purple gradient with pulse animation
- ⏸️ Idle buses: Gray
- ⚙️ Maintenance: Orange
- 📍 Bus stops: Green

### Data Visualization
- **Fleet Status Doughnut Chart**: Quick overview of bus status distribution
- **Route Performance Bar Chart**: On-time performance metrics
- **Activity Timeline**: Real-time event logging

### Map Layers
1. **Street Map**: Standard OpenStreetMap tiles
2. **Satellite**: Satellite imagery from ESRI
3. **Dark Mode**: Dark map for night operations

## API Integration

### Endpoints Used
- `GET /api/passenger/buses` - Fetch all buses
- `GET /api/passenger/buses?q=query` - Search buses
- `GET /api/passenger/eta/<bus_id>` - Get ETA

### WebSocket Events
- `bus_location`: Real-time bus location updates
- `alert`: Alert notifications
- `joined`: Room join confirmation

## Customization

### Theme Colors
Edit CSS variables in `dashboard.css`:
```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  /* ... other colors ... */
}
```

### Sidebar Navigation
Add new sections in `dashboard.html` and register in `dashboard.js`

### Map Styles
Extend `createMap()` in `map-advanced.js` with additional tile layers

## Performance Optimizations
- Lazy loading of data
- Efficient DOM manipulation
- CSS animations for smooth transitions
- WebSocket for real-time updates (no polling)
- Responsive image loading

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements
- [ ] Print-friendly reports
- [ ] Export data to CSV/PDF
- [ ] Advanced filtering and sorting
- [ ] User role-based access control
- [ ] Custom alert rules
- [ ] Route optimization
- [ ] Predictive analytics
- [ ] Mobile app integration

## Development Notes

### Adding New Sections
1. Create HTML section in `dashboard.html`
2. Add navigation item in sidebar
3. Implement section logic in `BusTrackingDashboard` class
4. Style in `dashboard.css`

### Extending Map Features
1. Use the public API provided by `createMap()`
2. Add custom markers/overlays
3. Implement new visualization methods
4. Test with sample data

## Troubleshooting

### Map not loading
- Check if Leaflet library is loaded
- Verify map container element exists
- Check browser console for errors

### Real-time updates not working
- Verify WebSocket connection in console
- Check if Socket.IO is properly configured
- Ensure server is running

### Data not displaying
- Check API endpoints are accessible
- Verify CORS is properly configured
- Check browser console for network errors

## License
All rights reserved © 2025 Bus Tracking System

## Support
For issues or feature requests, contact the development team.

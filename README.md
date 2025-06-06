# 🛠️ alt:V Developer Tools

[![alt:V](https://img.shields.io/badge/alt:V-Compatible-00A2FF?style=flat-square&logo=altv)](https://altv.mp/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)](https://github.com/dev-leva1/altv-dev-tools)

A comprehensive developer tools resource for alt:V Multiplayer servers. Features a modern, minimalist interface with noclip, godmode, teleportation, vehicle spawning, world management, and performance monitoring.

![alt:V Developer Tools](https://i.ibb.co/xKrxXNbD/911-EA3-F7-9-BD7-4338-9044-C767-D523-EA0-A.png)
## ✨ Features

### 🎮 **Core Functions**
- **Noclip** - Fly and pass through walls
- **Godmode** - Player invincibility
- **Health & Armor** - Adjustable from 0-100
- **Hotkeys** - Quick access keyboard shortcuts

### 🚀 **Teleportation**
- **Coordinate Teleport** - Precise movement to any location
- **Quick Locations** - Predefined hotspots (Airport, Vinewood, etc.)
- **Player Teleport** - Teleport to other players
- **Bring Player** - Teleport players to your location

### 🚗 **Vehicle Management**
- **Vehicle Spawning** - Quick spawn popular vehicles
- **Custom Models** - Enter any vehicle model name
- **Auto Enter** - Automatically enters spawned vehicle
- **Mass Deletion** - Remove all or spawned-only vehicles

### 🌍 **World Control**
- **Weather Control** - All GTA V weather types
- **Time Setting** - Precise time of day control
- **Global Changes** - Affects all connected players

### 👥 **Player Management**
- **Online List** - Information about all connected players
- **Player Stats** - Health, armor, ping, position data
- **Quick Actions** - Teleport to/bring players instantly

### 📊 **Performance Monitoring**
- **Server Performance** - Memory usage, uptime tracking
- **Object Counts** - Players, vehicles, entities
- **Real-time Data** - Auto-refreshing statistics

## 🎨 **Modern UI Design**

The developer panel features a **minimalist, futuristic design** inspired by alt:V's interface aesthetics:

- **Color Scheme**: Black & white with subtle gradients
- **Typography**: JetBrains Mono monospace font
- **Layout**: Clean lines, no rounded corners
- **Effects**: Hover animations and scanning effects
- **Responsive**: Adapts to different screen resolutions

## ⌨️ **Controls**

### **Hotkeys**
| Key | Action |
|-----|--------|
| `F2` | Toggle developer panel |
| `ESC` | Close developer panel |
| `F3` | Toggle Noclip |
| `F4` | Toggle Godmode |

### **Noclip Controls**
| Key | Action |
|-----|--------|
| `WASD` | Horizontal movement |
| `Space` | Move up |
| `Ctrl` | Move down |
| `Shift` | Speed boost (hold) |

### **Console Commands**
| Command | Description |
|---------|-------------|
| `/dev` | Open developer panel for all players |
| `/noclip [player]` | Enable noclip for specific player |
| `/tp [x] [y] [z]` | Teleport all players |
| `/car [model]` | Spawn vehicle for all players |
| `/heal` | Restore health and armor for all players |
| `/god` | Toggle godmode for all players |

## 🖥️ **Interface Overview**

### **Panel Tabs**
1. **Core** - Main functions and quick commands
2. **Teleport** - Coordinate and location teleportation
3. **Vehicles** - Vehicle spawning and management
4. **World** - Weather and time control
5. **Players** - Online player management
6. **System** - Performance monitoring and statistics

### **UI Features**
- **Modern Design** - Minimalist black & white theme
- **Responsive** - Adapts to different resolutions
- **Intuitive** - Clear icons and labels
- **Fast Access** - All functions within few clicks
- **Smooth Animations** - Hover effects and transitions

## 🏗️ **Technical Details**

### **Architecture**
```
dev/
├── resource.toml          # Resource configuration
├── server/index.js        # Server-side logic
├── client/index.js        # Client-side logic
├── shared/index.js        # Shared constants
└── client/html/           # Web interface
    ├── index.html         # HTML structure
    ├── style.css          # Modern UI styles
    └── script.js          # JavaScript logic
```

### **Events**
- `dev:toggleNoclip` - Toggle noclip state
- `dev:teleport` - Coordinate teleportation
- `dev:spawnVehicle` - Vehicle creation
- `dev:setWeather` - Weather modification
- `dev:getPerformance` - Performance data request

### **Security**
- **Server Validation** - All actions verified server-side
- **Value Limits** - Health/armor 0-100, input sanitization
- **Logging** - All actions recorded in server.log
- **Anti-cheat Ready** - Server-authoritative design

## 📦 **Installation**

1. **Download** the resource and place it in your `resources/` folder
2. **Add** to your `server.toml`:
   ```toml
   resources = [
       # ... other resources
       'dev'
   ]
   ```
3. **Restart** your alt:V server
4. **Connect** to the server
5. **Press F2** to open the developer panel

## 🔧 **Configuration**

### **Adding Custom Locations**
Edit `TELEPORT_LOCATIONS` in `shared/index.js`:
```javascript
export const TELEPORT_LOCATIONS = {
    'Custom Location': { x: 100, y: 200, z: 30 },
    'Another Spot': { x: -500, y: 300, z: 50 }
};
```

### **Adding Custom Vehicles**
Update `VEHICLES` in `shared/index.js`:
```javascript
export const VEHICLES = {
    'Custom Car': 'model_name',
    'Special Vehicle': 'special_model'
};
```

### **Weather Types**
Available weather options in `shared/index.js`:
```javascript
export const WEATHER_TYPES = [
    'CLEAR', 'EXTRASUNNY', 'CLOUDS', 'OVERCAST',
    'RAIN', 'CLEARING', 'THUNDER', 'SMOG',
    'FOGGY', 'XMAS', 'SNOWLIGHT', 'BLIZZARD'
];
```

## 🤝 **Compatibility**

- **alt:V Version**: Compatible with latest stable releases
- **Other Resources**: Non-conflicting with existing resources
- **Performance**: Minimal server impact
- **Cross-platform**: Works on Windows and Linux servers

## 🚀 **Development**

### **Adding New Features**
1. Add event to `shared/index.js`
2. Implement server logic in `server/index.js`
3. Add client handling in `client/index.js`
4. Update UI in `client/html/`

### **Customizing UI**
The interface uses CSS custom properties for easy theming:
```css
:root {
    --primary-bg: #000000;
    --secondary-bg: #1a1a1a;
    --border-color: #333333;
    --text-color: #ffffff;
    --accent-color: #ffffff;
}
```

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Panel won't open**: Check if resource is active in `server.toml`
2. **Functions not working**: Verify server logs for errors
3. **UI styling issues**: Clear browser cache (Ctrl+F5)
4. **Permission errors**: Ensure proper server configuration

### **Debug Mode**
Enable debug logging by setting `debug: true` in `resource.toml`:
```toml
type = 'js'
main = 'server/index.js'
client-main = 'client/index.js'
client-files = ['client/html/*']
debug = true
```

## 📝 **Changelog**

### **v2.0.0** - Latest
- Complete UI redesign with minimalist aesthetic
- Updated to alt:V latest compatibility
- Enhanced performance monitoring
- Improved security measures
- English localization

### **v1.0.0** - Initial Release
- Basic developer tools
- Noclip and godmode functionality
- Vehicle spawning system
- World management features

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Credits**

- **alt:V Team** - For the amazing multiplayer platform
- **Community** - For feedback and suggestions
- **Contributors** - For code improvements and bug fixes

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/dev-leva1/altv-dev-tools/issues)
- **Documentation**: [alt:V Documentation](https://docs.altv.mp/)

---

<div align="center">

**Made with ❤️ for the alt:V community**

⭐ **Star this repository if it helped you!** ⭐

</div> 
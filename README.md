# 🛠️ alt:V Developer Tools

[![alt:V](https://img.shields.io/badge/alt:V-Compatible-00A2FF?style=flat-square&logo=altv)](https://altv.mp/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-3.0.0-blue?style=flat-square)](https://github.com/dev-leva1/altv-dev-tools)

A comprehensive developer tools resource for alt:V Multiplayer servers. Features camera-based noclip, waypoint teleportation, invisibility, super jump, infinite ammo, time control, and advanced utilities with a modern minimalist interface.

![alt:V Developer Tools](https://i.ibb.co/xKrxXNbD/911-EA3-F7-9-BD7-4338-9044-C767-D523-EA0-A.png)
## ✨ Features

### 🎮 **Core Functions**
- **Camera-based Noclip** - Intuitive flight following camera direction
- **Godmode** - Player invincibility with server validation
- **Health & Armor** - Adjustable from 0-100 with instant updates
- **Enhanced Hotkeys** - F2-F6 for quick access to all functions

### 🚀 **Teleportation**
- **Smart Waypoint Teleport** - Teleport to map waypoint with ground detection
- **Coordinate Teleport** - Precise movement to any location
- **Quick Locations** - Predefined hotspots (Airport, Vinewood, etc.)
- **Player Management** - Teleport to/bring players with validation
- **Position Saving** - Save and load named locations

### 🚗 **Vehicle Management**
- **Enhanced Vehicle Library** - Military, Service, and Utility vehicles
- **Custom Models** - Enter any vehicle model name with validation
- **Auto Enter** - Automatically enters spawned vehicle
- **Smart Deletion** - Remove all vehicles or track spawned-only
- **Vehicle Information** - SAMP-style display system

### 🌍 **World Control**
- **Weather Control** - All GTA V weather types with instant switching
- **Time Management** - Precise time control with freeze option
- **Global Synchronization** - Changes affect all connected players

### 👥 **Player Management**
- **Online List** - Real-time information about all connected players
- **Player Stats** - Health, armor, ping, position with live updates
- **Quick Actions** - Teleport to/bring players with server validation
- **Mass Actions** - Heal all players, manage groups

### 📊 **Advanced Features**
- **Invisibility Mode** - Toggle player visibility (F5)
- **Super Jump** - Enhanced jumping with velocity control (F6)
- **Infinite Ammo** - Automatic ammunition replenishment
- **Movement Speed** - Adjustable speed multiplier (0.1x-5.0x)
- **Time Freeze** - Stop game time while maintaining control
- **Explosion Creation** - Create explosions at player position
- **Performance Monitoring** - Real-time server statistics

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
| `F3` | Toggle Camera-based Noclip |
| `F4` | Toggle Godmode |
| `F5` | Toggle Invisibility |
| `F6` | Toggle Super Jump |

### **Enhanced Noclip Controls**
| Key | Action |
|-----|--------|
| `WASD` | Camera-direction movement |
| `Space` | Move up / Super Jump |
| `Ctrl` | Move down |
| `Shift` | Speed boost (hold) |
| **Speed Slider** | Adjust movement multiplier |

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

### **Enhanced Panel Tabs**
1. **Core** - Essential functions with hotkey reference
2. **Teleport** - Waypoint, coordinates, and saved positions
3. **Vehicles** - Enhanced spawning with vehicle information
4. **World** - Weather control and time management
5. **Players** - Online management with mass actions
6. **System** - Performance monitoring and advanced features

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

### **Enhanced Events**
- `dev:toggleNoclip` - Camera-based noclip toggle
- `dev:teleportToWaypoint` - Smart waypoint teleportation
- `dev:toggleInvisible` - Invisibility mode toggle
- `dev:toggleSuperJump` - Super jump toggle
- `dev:setMovementSpeed` - Movement speed multiplier
- `dev:toggleFreezeTime` - Time freeze control
- `dev:savePosition` - Position saving system
- `dev:createExplosion` - Explosion creation
- `dev:infiniteAmmo` - Infinite ammunition toggle

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

### **v3.0.0** - Latest
- Camera-based noclip with intuitive controls
- Smart waypoint teleportation with ground detection
- Advanced functions: invisibility, super jump, infinite ammo
- Time freeze and movement speed control
- Position saving and explosion creation
- Enhanced vehicle management and information display
- Production-ready code with optimized performance

### **v2.0.0** - UI Redesign
- Complete minimalist UI redesign
- Enhanced performance monitoring
- Improved security measures
- English localization

### **v1.0.0** - Initial Release
- Basic developer tools foundation
- Core noclip and godmode functionality
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
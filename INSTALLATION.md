# 📥 Installation Guide

This guide will help you install and configure the alt:V Developer Tools on your server.

## 📋 Prerequisites

Before installing, make sure you have:

- **alt:V Server** (latest stable version)
- **Node.js** environment set up
- **Basic knowledge** of alt:V resource management

## 🚀 Quick Installation

### Method 1: Download Release

1. **Download** the latest release from [GitHub Releases](https://github.com/dev-leva1/altv-dev-tools/releases)
2. **Extract** the files to your alt:V `resources/` directory
3. **Rename** the folder to `dev` if necessary

### Method 2: Git Clone

```bash
cd /path/to/your/altv/resources/
git clone https://github.com/dev-leva1/altv-dev-tools.git dev
```

## ⚙️ Configuration

### 1. Server Configuration

Add the resource to your `server.toml`:

```toml
# Server configuration
name = 'My alt:V Server'
host = '0.0.0.0'
port = 7788
players = 128
announce = false
gamemode = 'Freeroam'
website = 'example.com'
language = 'en'
description = 'My awesome alt:V server'

# Add dev resource to the list
resources = [
    'chat',
    'freeroam',
    'dev'  # Add this line
]

# Module configuration
modules = [
    'js-module'
]
```

### 2. Resource Configuration

The resource comes with a pre-configured `resource.toml`:

```toml
type = 'js'
main = 'server/index.js'
client-main = 'client/index.js'
client-files = [
    'client/html/*'
]

# Optional: Enable debug mode
# debug = true
```

### 3. File Structure Verification

Ensure your file structure looks like this:

```
resources/
└── dev/
    ├── resource.toml
    ├── README.md
    ├── LICENSE
    ├── server/
    │   └── index.js
    ├── client/
    │   ├── index.js
    │   └── html/
    │       ├── index.html
    │       ├── style.css
    │       └── script.js
    └── shared/
        └── index.js
```

## 🔧 Advanced Configuration

### Custom Locations

Edit `shared/index.js` to add custom teleport locations:

```javascript
export const TELEPORT_LOCATIONS = {
    'Airport': { x: -1037.5, y: -2737.6, z: 20.2 },
    'Vinewood': { x: 120.9, y: 564.1, z: 183.96 },
    'Downtown': { x: 228.3, y: -993.3, z: 29.4 },
    // Add your custom locations here
    'Custom Location': { x: 100, y: 200, z: 30 }
};
```

### Custom Vehicles

Add your favorite vehicles to the spawn list:

```javascript
export const VEHICLES = {
    'Adder': 'adder',
    'Zentorno': 'zentorno',
    'T20': 't20',
    // Add custom vehicles here
    'Custom Car': 'your_model_name'
};
```

### Weather Options

Configure available weather types:

```javascript
export const WEATHER_TYPES = [
    'CLEAR',
    'EXTRASUNNY',
    'CLOUDS',
    'OVERCAST',
    'RAIN',
    'CLEARING',
    'THUNDER',
    'SMOG',
    'FOGGY',
    'XMAS',
    'SNOWLIGHT',
    'BLIZZARD'
];
```

## 🎮 First Use

1. **Start** your alt:V server
2. **Connect** to the server
3. **Press F2** to open the developer panel
4. **Test** the basic functions:
   - Toggle noclip with F3
   - Toggle godmode with F4
   - Use the interface to spawn vehicles
   - Try teleportation features

## 🔒 Security Settings

### Permission System (Optional)

If you want to restrict access, you can implement a permission system by modifying `server/index.js`:

```javascript
// Example permission check
function hasPermission(player) {
    // Implement your permission logic here
    return player.getMeta('isDeveloper') || false;
}

// Use in event handlers
alt.onClient('dev:toggleNoclip', (player) => {
    if (!hasPermission(player)) {
        player.emit('dev:error', 'No permission');
        return;
    }
    // ... rest of the function
});
```

### Admin-Only Mode

To restrict to admins only, modify the permission check:

```javascript
function hasPermission(player) {
    return player.getMeta('isAdmin') === true;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Panel doesn't open (F2)**
   - Check if resource is loaded: look for "dev resource started" in console
   - Verify resource is in `server.toml`
   - Check browser console (F12) for JavaScript errors

2. **Functions don't work**
   - Check server console for errors
   - Verify server-side events are being received
   - Ensure alt:V client is up to date

3. **UI styling issues**
   - Clear browser cache (Ctrl+F5)
   - Check if CSS files are loading properly
   - Verify client-files in resource.toml

4. **Permission errors**
   - Disable permission checks for testing
   - Verify admin status if using permission system
   - Check server logs for authentication errors

### Debug Mode

Enable debug mode in `resource.toml`:

```toml
debug = true
```

This will provide additional console output for troubleshooting.

### Log Analysis

Check these log locations:

- **Server logs**: `server.log` in alt:V root directory
- **Browser console**: F12 → Console tab
- **Resource logs**: Look for `[DEV]` prefixed messages

## 🔄 Updates

### Updating the Resource

1. **Backup** your custom configurations
2. **Download** the latest version
3. **Replace** old files with new ones
4. **Restore** your custom configurations
5. **Restart** the server

### Version Compatibility

This resource is compatible with:
- alt:V 15.0+ (latest stable)
- Node.js 16.0+
- Modern browsers (Chrome, Firefox, Edge)

## ✅ Verification

After installation, verify everything works:

- [ ] Resource starts without errors
- [ ] F2 opens the developer panel
- [ ] F3 toggles noclip
- [ ] F4 toggles godmode
- [ ] Teleportation works
- [ ] Vehicle spawning works
- [ ] Weather/time controls work
- [ ] Player management works
- [ ] Performance monitoring displays data

## 💡 Next Steps

- Read the [README.md](README.md) for feature overview
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development info

---

Need help? Open an issue on [GitHub](https://github.com/dev-leva1/altv-dev-tools/issues)! 
let currentStates = {
    noclip: false,
    godmode: false,
    invisible: false,
    superJump: false,
    freezeTime: false,
    infiniteAmmo: false,
    movementSpeed: 1.0,
    savedPositions: [],
    vehicles: {},
    weather: [],
    locations: {}
};

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(135deg, #000000, #1a1a1a);
        color: #ffffff;
        border: 1px solid ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#333333'};
        border-left: 3px solid ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#ffffff'};
        padding: 15px 20px;
        border-radius: 0;
        z-index: 11000;
        box-shadow: 0 0 20px rgba(0,0,0,0.8);
        font-size: 12px;
        font-family: 'JetBrains Mono', monospace;
        max-width: 350px;
        word-wrap: break-word;
        text-transform: uppercase;
        letter-spacing: 1px;
        backdrop-filter: blur(10px);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function closePanel() {
    if ('alt' in window) {
        alt.emit('dev:close');
    }
}

function toggleNoclip() {
    if ('alt' in window) {
        alt.emit('dev:toggleNoclip');
    }
}

function toggleGodmode() {
    if ('alt' in window) {
        alt.emit('dev:toggleGodmode');
    }
}

function setHealth(value) {
    document.getElementById('health-value').textContent = value;
    if ('alt' in window) {
        alt.emit('dev:setHealth', parseInt(value));
    }
}

function setArmour(value) {
    document.getElementById('armour-value').textContent = value;
    if ('alt' in window) {
        alt.emit('dev:setArmour', parseInt(value));
    }
}

function teleportToCoords() {
    const x = parseFloat(document.getElementById('tp-x').value);
    const y = parseFloat(document.getElementById('tp-y').value);
    const z = parseFloat(document.getElementById('tp-z').value);
    
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        if ('alt' in window) {
            alt.emit('dev:teleport', x, y, z);
        }
        
        document.getElementById('tp-x').value = '';
        document.getElementById('tp-y').value = '';
        document.getElementById('tp-z').value = '';
    }
}

function teleportToLocation(locationName) {
    if ('alt' in window) {
        alt.emit('dev:teleportLocation', locationName);
    }
}

function spawnVehicle(model) {
    if ('alt' in window) {
        alt.emit('dev:spawnVehicle', model);
    }
}

function spawnCustomVehicle() {
    const model = document.getElementById('custom-vehicle').value.trim();
    if (model) {
        spawnVehicle(model);
        document.getElementById('custom-vehicle').value = '';
    }
}

function setWeather(weather) {
    if ('alt' in window) {
        alt.emit('dev:setWeather', weather);
    }
}

function setTime() {
    const hour = parseInt(document.getElementById('time-hour').value) || 12;
    const minute = parseInt(document.getElementById('time-minute').value) || 0;
    
    if ('alt' in window) {
        alt.emit('dev:setTime', hour, minute);
    }
}

function teleportToPlayer(playerId) {
    if ('alt' in window) {
        alt.emit('dev:teleportToPlayer', playerId);
    }
}

function bringPlayer(playerId) {
    if ('alt' in window) {
        alt.emit('dev:bringPlayer', playerId);
    }
}

function refreshData() {
    if ('alt' in window) {
        alt.emit('dev:refreshData');
    }
}

function toggleInvisible() {
    if ('alt' in window) {
        alt.emit('dev:toggleInvisible');
    }
}

function toggleSuperJump() {
    if ('alt' in window) {
        alt.emit('dev:toggleSuperJump');
    }
}

function toggleInfiniteAmmo() {
    if ('alt' in window) {
        alt.emit('dev:infiniteAmmo');
    }
}

function toggleFreezeTime() {
    if ('alt' in window) {
        alt.emit('dev:toggleFreezeTime');
    }
}

function setMovementSpeed(value) {
    document.getElementById('speed-value').textContent = value;
    if ('alt' in window) {
        alt.emit('dev:setMovementSpeed', parseFloat(value));
    }
}

function createExplosion() {
    if ('alt' in window) {
        alt.emit('dev:createExplosion');
    }
}

function healAllPlayers() {
    if ('alt' in window) {
        alt.emit('dev:healAllPlayers');
    }
}

function teleportToWaypoint() {
    if ('alt' in window) {
        alt.emit('dev:teleportToWaypoint');
    }
}

function saveCurrentPosition() {
    const name = document.getElementById('save-name').value.trim();
    if (name) {
        if ('alt' in window) {
            alt.emit('dev:savePosition', name);
        }
        document.getElementById('save-name').value = '';
    }
}

function loadSavedPosition(name) {
    if ('alt' in window) {
        alt.emit('dev:loadPosition', name);
    }
}

function deleteAllVehicles() {
    console.log('[DEV] deleteAllVehicles button clicked');

    const confirmDialog = document.createElement('div');
    confirmDialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    confirmDialog.innerHTML = `
        <div style="background: linear-gradient(135deg, #000000, #1a1a1a); border: 1px solid #333333; padding: 30px; border-radius: 0; max-width: 500px; text-align: center; backdrop-filter: blur(20px);">
            <h3 style="color: #ff6b6b; margin-top: 0; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 300;">WARNING</h3>
            <p style="color: #ffffff; margin: 20px 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6;">Delete all vehicles on server?</p>
            <ul style="color: #ffeb3b; text-align: left; margin: 20px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; list-style: none; padding: 0;">
                <li style="margin-bottom: 8px;">• All vehicles will be removed</li>
                <li>• This action cannot be undone</li>
            </ul>
            <div style="margin-top: 25px; display: flex; gap: 15px; justify-content: center;">
                <button id="confirm-delete-all" style="background: transparent; border: 1px solid #f44336; color: #f44336; padding: 12px 24px; border-radius: 0; cursor: pointer; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; transition: all 0.2s ease;">Confirm</button>
                <button id="cancel-delete-all" style="background: transparent; border: 1px solid #4caf50; color: #4caf50; padding: 12px 24px; border-radius: 0; cursor: pointer; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; transition: all 0.2s ease;">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmDialog);
    
    const confirmBtn = document.getElementById('confirm-delete-all');
    const cancelBtn = document.getElementById('cancel-delete-all');

    confirmBtn.onmouseenter = () => {
        confirmBtn.style.background = '#f44336';
        confirmBtn.style.color = '#ffffff';
    };
    confirmBtn.onmouseleave = () => {
        confirmBtn.style.background = 'transparent';
        confirmBtn.style.color = '#f44336';
    };
    
    cancelBtn.onmouseenter = () => {
        cancelBtn.style.background = '#4caf50';
        cancelBtn.style.color = '#ffffff';
    };
    cancelBtn.onmouseleave = () => {
        cancelBtn.style.background = 'transparent';
        cancelBtn.style.color = '#4caf50';
    };
    
    confirmBtn.onclick = () => {
        console.log('[DEV] User confirmed, emitting dev:deleteAllVehicles');
        document.body.removeChild(confirmDialog);
        if ('alt' in window) {
            console.log('[DEV] alt is available, emitting event');
            alt.emit('dev:deleteAllVehicles');
        } else {
            console.log('[DEV] alt not available in window');
        }
    };
    
    cancelBtn.onclick = () => {
        console.log('[DEV] User cancelled deletion');
        document.body.removeChild(confirmDialog);
    };
}

function deleteSpawnedVehicles() {
    console.log('[DEV] deleteSpawnedVehicles button clicked');

    const confirmDialog = document.createElement('div');
    confirmDialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    confirmDialog.innerHTML = `
        <div style="background: linear-gradient(135deg, #000000, #1a1a1a); border: 1px solid #333333; padding: 30px; border-radius: 0; max-width: 500px; text-align: center; backdrop-filter: blur(20px);">
            <h3 style="color: #ff9800; margin-top: 0; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 300;">Delete Spawned</h3>
            <p style="color: #ffffff; margin: 20px 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6;">Remove only dev panel spawned vehicles?</p>
            <ul style="color: #ffeb3b; text-align: left; margin: 20px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; list-style: none; padding: 0;">
                <li style="margin-bottom: 8px;">• Regular vehicles will remain</li>
                <li style="margin-bottom: 8px;">• /veh spawned vehicles will remain</li>
                <li>• This action cannot be undone</li>
            </ul>
            <div style="margin-top: 25px; display: flex; gap: 15px; justify-content: center;">
                <button id="confirm-delete-spawned" style="background: transparent; border: 1px solid #ff9800; color: #ff9800; padding: 12px 24px; border-radius: 0; cursor: pointer; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; transition: all 0.2s ease;">Confirm</button>
                <button id="cancel-delete-spawned" style="background: transparent; border: 1px solid #4caf50; color: #4caf50; padding: 12px 24px; border-radius: 0; cursor: pointer; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; transition: all 0.2s ease;">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmDialog);
    
    const confirmSpawnedBtn = document.getElementById('confirm-delete-spawned');
    const cancelSpawnedBtn = document.getElementById('cancel-delete-spawned');
    
    confirmSpawnedBtn.onmouseenter = () => {
        confirmSpawnedBtn.style.background = '#ff9800';
        confirmSpawnedBtn.style.color = '#ffffff';
    };
    confirmSpawnedBtn.onmouseleave = () => {
        confirmSpawnedBtn.style.background = 'transparent';
        confirmSpawnedBtn.style.color = '#ff9800';
    };
    
    cancelSpawnedBtn.onmouseenter = () => {
        cancelSpawnedBtn.style.background = '#4caf50';
        cancelSpawnedBtn.style.color = '#ffffff';
    };
    cancelSpawnedBtn.onmouseleave = () => {
        cancelSpawnedBtn.style.background = 'transparent';
        cancelSpawnedBtn.style.color = '#4caf50';
    };
    
    confirmSpawnedBtn.onclick = () => {
        console.log('[DEV] User confirmed, emitting dev:deleteSpawnedVehicles');
        document.body.removeChild(confirmDialog);
        if ('alt' in window) {
            console.log('[DEV] alt is available, emitting event');
            alt.emit('dev:deleteSpawnedVehicles');
        } else {
            console.log('[DEV] alt not available in window');
        }
    };
    
    cancelSpawnedBtn.onclick = () => {
        console.log('[DEV] User cancelled spawned deletion');
        document.body.removeChild(confirmDialog);
    };
}

function toggleVehicleInfo() {
    if ('alt' in window) {
        alt.emit('dev:toggleVehicleInfo');
    }
}

function updateStates(states) {
    currentStates = { ...currentStates, ...states };
    
    updateButtonState('noclip-btn', `Noclip: ${states.noclip ? 'ON' : 'OFF'}`, states.noclip);
    updateButtonState('godmode-btn', `Godmode: ${states.godmode ? 'ON' : 'OFF'}`, states.godmode);
    updateButtonState('invisible-btn', `Invisible: ${states.invisible ? 'ON' : 'OFF'}`, states.invisible);
    updateButtonState('super-jump-btn', `Super Jump: ${states.superJump ? 'ON' : 'OFF'}`, states.superJump);
    updateButtonState('infinite-ammo-btn', `Infinite Ammo: ${states.infiniteAmmo ? 'ON' : 'OFF'}`, states.infiniteAmmo);
    updateButtonState('freeze-time-btn', `Freeze Time: ${states.freezeTime ? 'ON' : 'OFF'}`, states.freezeTime);

    if (states.vehicleInfo !== undefined) {
        const vehicleInfoBtn = document.getElementById('vehicle-info-btn');
        if (vehicleInfoBtn) {
            vehicleInfoBtn.textContent = `Vehicle Info: ${states.vehicleInfo ? 'ON' : 'OFF'}`;
            if (states.vehicleInfo) {
                vehicleInfoBtn.style.background = '#ffffff';
                vehicleInfoBtn.style.color = '#000000';
                vehicleInfoBtn.style.borderColor = '#ffffff';
            } else {
                vehicleInfoBtn.style.background = 'transparent';
                vehicleInfoBtn.style.color = '#ffffff';
                vehicleInfoBtn.style.border = '1px solid #333333';
            }
        }
    }

    if (states.movementSpeed !== undefined) {
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        if (speedSlider && speedValue) {
            speedSlider.value = states.movementSpeed;
            speedValue.textContent = states.movementSpeed;
        }
    }
    
    populateLocations(states.locations);
    populateVehicles(states.vehicles);
    populateWeather(states.weather);
    
    if (states.savedPositions) {
        populateSavedPositions(states.savedPositions);
    }
}

function updateButtonState(buttonId, text, isActive) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.textContent = text;
        if (isActive) {
            button.style.background = '#ffffff';
            button.style.color = '#000000';
            button.style.borderColor = '#ffffff';
        } else {
            button.style.background = 'transparent';
            button.style.color = '#ffffff';
            button.style.border = '1px solid #333333';
        }
    }
}

function populateLocations(locations) {
    const container = document.getElementById('locations-list');
    container.innerHTML = '';
    
    Object.keys(locations).forEach(locationName => {
        const button = document.createElement('button');
        button.className = 'location-btn';
        button.textContent = locationName;
        button.onclick = () => teleportToLocation(locationName);
        container.appendChild(button);
    });
}

function populateVehicles(vehicles) {
    const container = document.getElementById('vehicles-list');
    container.innerHTML = '';
    
    Object.entries(vehicles).forEach(([displayName, model]) => {
        const button = document.createElement('button');
        button.className = 'vehicle-btn';
        button.textContent = displayName;
        button.onclick = () => spawnVehicle(model);
        container.appendChild(button);
    });
}

function populateWeather(weatherTypes) {
    const container = document.getElementById('weather-list');
    container.innerHTML = '';
    
    weatherTypes.forEach(weather => {
        const button = document.createElement('button');
        button.className = 'weather-btn';
        button.textContent = weather;
        button.onclick = () => setWeather(weather);
        container.appendChild(button);
    });
}

function populateSavedPositions(positions) {
    const container = document.getElementById('saved-positions-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    positions.forEach(positionName => {
        const button = document.createElement('button');
        button.className = 'location-btn';
        button.textContent = positionName;
        button.onclick = () => loadSavedPosition(positionName);
        container.appendChild(button);
    });
}

function updatePerformance(data) {
    const container = document.getElementById('performance-info');
    container.innerHTML = '';
    
    const metrics = [
        { label: 'Players online', value: data.players, suffix: '' },
        { label: 'Vehicles', value: data.vehicles, suffix: '' },
        { label: 'Uptime', value: Math.floor(data.uptime / 60), suffix: 'min' },
        { label: 'Memory (RSS)', value: Math.round(data.memory.rss / 1024 / 1024), suffix: 'MB' },
        { label: 'Memory (Heap)', value: Math.round(data.memory.heapUsed / 1024 / 1024), suffix: 'MB' },
        { label: 'External memory', value: Math.round(data.memory.external / 1024 / 1024), suffix: 'MB' }
    ];
    
    metrics.forEach(metric => {
        const item = document.createElement('div');
        item.className = 'performance-item';
        item.innerHTML = `
            <div class="performance-value">${metric.value}${metric.suffix}</div>
            <div class="performance-label">${metric.label}</div>
        `;
        container.appendChild(item);
    });
}

function updatePlayers(players) {
    const container = document.getElementById('players-list');
    container.innerHTML = '';
    
    if (players.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #9aa0a6; padding: 20px;">No players online</div>';
        return;
    }
    
    players.forEach(player => {
        const item = document.createElement('div');
        item.className = 'player-item';
        item.innerHTML = `
            <div class="player-info">
                <div class="player-name">${player.name} (ID: ${player.id})</div>
                <div class="player-stats">
                    Health: ${player.health} | Armour: ${player.armour} | Ping: ${player.ping}ms
                    <br>Position: ${Math.round(player.pos.x)}, ${Math.round(player.pos.y)}, ${Math.round(player.pos.z)}
                </div>
            </div>
            <div class="player-actions">
                <button onclick="teleportToPlayer(${player.id})">To player</button>
                <button onclick="bringPlayer(${player.id})">Bring</button>
            </div>
        `;
        container.appendChild(item);
    });
}

if ('alt' in window) {
    alt.on('updateStates', updateStates);
    alt.on('updatePerformance', updatePerformance);
    alt.on('updatePlayers', updatePlayers);
    alt.on('showNotification', (message, type) => {
        showNotification(message, type);
    });
} else {
    setTimeout(() => {
        updateStates({
            noclip: false,
            godmode: false,
            vehicles: {
                'Adder': 'adder',
                'Zentorno': 'zentorno',
                'T20': 't20',
                'Kuruma': 'kuruma'
            },
            weather: ['EXTRASUNNY', 'CLEAR', 'RAIN', 'THUNDER'],
            locations: {
                'Los Santos Airport': { x: -1037.6, y: -2737.6, z: 20.2 },
                'Vinewood Sign': { x: 726.2, y: 1196.5, z: 326.7 }
            }
        });
        
        updatePerformance({
            players: 5,
            vehicles: 12,
            uptime: 3600,
            memory: {
                rss: 150 * 1024 * 1024,
                heapUsed: 80 * 1024 * 1024,
                external: 20 * 1024 * 1024
            }
        });
        
        updatePlayers([
            {
                id: 1,
                name: 'TestPlayer1',
                pos: { x: 100, y: 200, z: 30 },
                health: 100,
                armour: 100,
                ping: 45
            },
            {
                id: 2,
                name: 'TestPlayer2',
                pos: { x: -500, y: 1000, z: 25 },
                health: 75,
                armour: 50,
                ping: 67
            }
        ]);
    }, 1000);
} 
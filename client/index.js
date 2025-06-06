import alt from 'alt-client';
import * as native from 'natives';
import { DEV_EVENTS, VEHICLES, WEATHER_TYPES, TELEPORT_LOCATIONS } from '../shared/index.js';

let isNoclipEnabled = false;
let isGodmodeEnabled = false;
let isVehicleInfoEnabled = false;
let devPanel = null;
let isDevPanelOpen = false;

alt.on('resourceStart', () => {
    alt.log('[DEV] Client development tools loaded');
});

alt.on('resourceStop', () => {
    if (isNoclipEnabled) {
        stopNoclip();
    }
    if (isGodmodeEnabled) {
        stopGodmode();
    }
    if (isVehicleInfoEnabled) {
        stopVehicleInfo();
    }
    if (devPanel) {
        closeDevPanel();
    }
});

alt.on('keydown', (key) => {
    if (key === 113) { // F2
        toggleDevPanel();
    }
    
    if (key === 27 && isDevPanelOpen) { // Escape
        closeDevPanel();
    }
    
    if (key === 114) { // F3
        alt.emitServer(DEV_EVENTS.TOGGLE_NOCLIP);
    }
    
    if (key === 115) { // F4
        alt.emitServer(DEV_EVENTS.TOGGLE_GODMODE);
    }
});

alt.onServer('dev:noclipState', (enabled) => {
    isNoclipEnabled = enabled;
    alt.log(`[DEV] Noclip ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        startNoclip();
    } else {
        stopNoclip();
    }
});

alt.onServer('dev:godmodeState', (enabled) => {
    isGodmodeEnabled = enabled;
    alt.log(`[DEV] Godmode ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        startGodmode();
    } else {
        stopGodmode();
    }
});

alt.onServer('dev:openPanel', () => {
    if (!isDevPanelOpen) {
        openDevPanel();
    }
});

alt.onServer('dev:performanceData', (data) => {
    if (devPanel) {
        devPanel.emit('updatePerformance', data);
    }
});

alt.onServer('dev:playersData', (data) => {
    if (devPanel) {
        devPanel.emit('updatePlayers', data);
    }
});

alt.onServer('dev:vehicleInfoState', (enabled) => {
    isVehicleInfoEnabled = enabled;
    alt.log(`[DEV] Vehicle Info ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        startVehicleInfo();
    } else {
        stopVehicleInfo();
    }
});

alt.onServer('dev:deleteAllVehiclesResult', (result) => {
    if (devPanel) {
        const message = result.success ? 
            `✅ Deleted ${result.count} vehicles` : 
            `❌ Error: ${result.error}`;
        const type = result.success ? 'success' : 'error';
        devPanel.emit('showNotification', message, type);
    }
});

alt.onServer('dev:deleteSpawnedVehiclesResult', (result) => {
    if (devPanel) {
        const message = result.success ? 
            `✅ Deleted ${result.count} spawned vehicles` : 
            `❌ Error: ${result.error}`;
        const type = result.success ? 'success' : 'error';
        devPanel.emit('showNotification', message, type);
    }
});

function toggleDevPanel() {
    if (isDevPanelOpen && devPanel) {
        closeDevPanel();
    } else {
        openDevPanel();
    }
}

function openDevPanel() {
    if (!devPanel) {
        devPanel = new alt.WebView("http://resource/client/html/index.html");
        setupWebViewEvents();
    }
    
    devPanel.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);
    isDevPanelOpen = true;
    
    setTimeout(() => {
        refreshPanelData();
    }, 100);
}

function closeDevPanel() {
    if (devPanel) {
        devPanel.unfocus();
        devPanel.destroy();
        devPanel = null;
        alt.showCursor(false);
        alt.toggleGameControls(true);
        isDevPanelOpen = false;
    }
}

function setupWebViewEvents() {
    devPanel.on('dev:close', () => {
        closeDevPanel();
    });
    
    devPanel.on('dev:toggleNoclip', () => {
        alt.emitServer(DEV_EVENTS.TOGGLE_NOCLIP);
    });
    
    devPanel.on('dev:teleport', (x, y, z) => {
        alt.emitServer(DEV_EVENTS.TELEPORT, x, y, z);
    });
    
    devPanel.on('dev:teleportLocation', (locationName) => {
        const location = TELEPORT_LOCATIONS[locationName];
        if (location) {
            alt.emitServer(DEV_EVENTS.TELEPORT, location.x, location.y, location.z);
        }
    });
    
    devPanel.on('dev:setHealth', (health) => {
        alt.emitServer(DEV_EVENTS.SET_HEALTH, health);
    });
    
    devPanel.on('dev:setArmour', (armour) => {
        alt.emitServer(DEV_EVENTS.SET_ARMOUR, armour);
    });
    
    devPanel.on('dev:spawnVehicle', (model) => {
        alt.emitServer(DEV_EVENTS.SPAWN_VEHICLE, model);
    });
    
    devPanel.on('dev:toggleGodmode', () => {
        alt.emitServer(DEV_EVENTS.TOGGLE_GODMODE);
    });
    
    devPanel.on('dev:setWeather', (weather) => {
        alt.emitServer(DEV_EVENTS.SET_WEATHER, weather);
    });
    
    devPanel.on('dev:setTime', (hour, minute) => {
        alt.emitServer(DEV_EVENTS.SET_TIME, hour, minute);
    });
    
    devPanel.on('dev:teleportToPlayer', (playerId) => {
        alt.emitServer(DEV_EVENTS.TELEPORT_TO_PLAYER, playerId);
    });
    
    devPanel.on('dev:bringPlayer', (playerId) => {
        alt.emitServer(DEV_EVENTS.BRING_PLAYER, playerId);
    });
    
    devPanel.on('dev:refreshData', () => {
        refreshPanelData();
    });
    
    devPanel.on('dev:deleteAllVehicles', () => {
        alt.log('[DEV] Client received dev:deleteAllVehicles from WebView');
        alt.emitServer(DEV_EVENTS.DELETE_ALL_VEHICLES);
    });
    
    devPanel.on('dev:deleteSpawnedVehicles', () => {
        alt.log('[DEV] Client received dev:deleteSpawnedVehicles from WebView');
        alt.emitServer(DEV_EVENTS.DELETE_SPAWNED_VEHICLES);
    });
    
    devPanel.on('dev:toggleVehicleInfo', () => {
        alt.emitServer(DEV_EVENTS.TOGGLE_VEHICLE_INFO);
    });
}

function refreshPanelData() {
    alt.emitServer(DEV_EVENTS.GET_PERFORMANCE);
    alt.emitServer(DEV_EVENTS.GET_PLAYERS);
    
    if (devPanel) {
        devPanel.emit('updateStates', {
            noclip: isNoclipEnabled,
            godmode: isGodmodeEnabled,
            vehicleInfo: isVehicleInfoEnabled,
            vehicles: VEHICLES,
            weather: WEATHER_TYPES,
            locations: TELEPORT_LOCATIONS
        });
    }
}

let noclipInterval = null;

function startNoclip() {
    if (noclipInterval) return;
    
    const localPlayer = alt.Player.local;
    native.setEntityCollision(localPlayer.scriptID, false, false);
    
    noclipInterval = alt.setInterval(() => {
        if (!isNoclipEnabled) return;
        
        const playerPos = localPlayer.pos;
        const playerRot = localPlayer.rot;
        let newPos = { ...playerPos };
        
        const speed = native.isControlPressed(0, 21) ? 2.0 : 0.5; // Left Shift for faster movement
        
        if (native.isControlPressed(0, 32)) { // W
            newPos.x += Math.sin(-playerRot.z) * speed;
            newPos.y += Math.cos(-playerRot.z) * speed;
        }
        if (native.isControlPressed(0, 33)) { // S
            newPos.x -= Math.sin(-playerRot.z) * speed;
            newPos.y -= Math.cos(-playerRot.z) * speed;
        }
        if (native.isControlPressed(0, 34)) { // A
            newPos.x -= Math.cos(-playerRot.z) * speed;
            newPos.y += Math.sin(-playerRot.z) * speed;
        }
        if (native.isControlPressed(0, 35)) { // D
            newPos.x += Math.cos(-playerRot.z) * speed;
            newPos.y -= Math.sin(-playerRot.z) * speed;
        }
        if (native.isControlPressed(0, 22)) { // Space
            newPos.z += speed;
        }
        if (native.isControlPressed(0, 36)) { // Left Ctrl
            newPos.z -= speed;
        }
        
        localPlayer.pos = newPos;
        native.setEntityVelocity(localPlayer.scriptID, 0, 0, 0);
        
    }, 0);
}

function stopNoclip() {
    if (noclipInterval) {
        alt.clearInterval(noclipInterval);
        noclipInterval = null;
    }
    
    const localPlayer = alt.Player.local;
    native.setEntityCollision(localPlayer.scriptID, true, true);
}

let godmodeInterval = null;

function startGodmode() {
    if (godmodeInterval) return;
    
    godmodeInterval = alt.setInterval(() => {
        if (!isGodmodeEnabled) return;
        
        const localPlayer = alt.Player.local;
        native.setEntityHealth(localPlayer.scriptID, 200, 0, 0);
        native.setPlayerInvincible(alt.Player.local.id, true);
        native.setEntityCanBeDamaged(localPlayer.scriptID, false);
    }, 100);
}

function stopGodmode() {
    if (godmodeInterval) {
        alt.clearInterval(godmodeInterval);
        godmodeInterval = null;
    }
    
    const localPlayer = alt.Player.local;
    native.setPlayerInvincible(alt.Player.local.id, false);
    native.setEntityCanBeDamaged(localPlayer.scriptID, true);
}

let vehicleInfoInterval = null;

function startVehicleInfo() {
    if (vehicleInfoInterval) return;
    
    vehicleInfoInterval = alt.setInterval(() => {
        if (!isVehicleInfoEnabled) return;
        
        const localPlayer = alt.Player.local;
        const playerPos = localPlayer.pos;
        
        alt.Vehicle.all.forEach(vehicle => {
            if (vehicle && vehicle.valid) {
                const vehiclePos = vehicle.pos;
                const distance = Math.sqrt(
                    Math.pow(playerPos.x - vehiclePos.x, 2) + 
                    Math.pow(playerPos.y - vehiclePos.y, 2) + 
                    Math.pow(playerPos.z - vehiclePos.z, 2)
                );
                
                if (distance <= 50.0) {
                    const vehicleModel = native.getEntityModel(vehicle.scriptID);
                    const vehicleDisplayName = native.getDisplayNameFromVehicleModel(vehicleModel);
                    const vehicleHash = `0x${vehicleModel.toString(16).toUpperCase()}`;
                    
                    const screenCoords = native.getScreenCoordFromWorldCoord(
                        vehiclePos.x, 
                        vehiclePos.y, 
                        vehiclePos.z
                    );
                    
                    if (screenCoords[0]) {
                        const infoText = `~w~${vehicleDisplayName}~n~~c~${vehicleHash}~n~~g~Distance: ${distance.toFixed(1)}m~n~~b~ID: ${vehicle.id}`;
                        
                        native.setTextFont(4);
                        native.setTextScale(0.35, 0.35);
                        native.setTextColour(255, 255, 255, 255);
                        native.setTextOutline();
                        native.setTextCentre(true);
                        native.beginTextCommandDisplayText("STRING");
                        native.addTextComponentSubstringPlayerName(infoText);
                        native.endTextCommandDisplayText(screenCoords[1], screenCoords[2], 0);
                    }
                }
            }
        });
    }, 0);
}

function stopVehicleInfo() {
    if (vehicleInfoInterval) {
        alt.clearInterval(vehicleInfoInterval);
        vehicleInfoInterval = null;
    }
} 
import alt from 'alt-client';
import * as native from 'natives';
import { DEV_EVENTS, VEHICLES, WEATHER_TYPES, TELEPORT_LOCATIONS } from '../shared/index.js';

let isNoclipEnabled = false;
let isGodmodeEnabled = false;
let isVehicleInfoEnabled = false;
let isInvisibleEnabled = false;
let isSuperJumpEnabled = false;
let isTimeFreezed = false;
let infiniteAmmoEnabled = false;
let movementSpeed = 1.0;
let savedPositions = {};
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
    if (isInvisibleEnabled) {
        stopInvisible();
    }
    if (isSuperJumpEnabled) {
        stopSuperJump();
    }
    if (infiniteAmmoEnabled) {
        stopInfiniteAmmo();
    }
    if (isTimeFreezed) {
        stopFreezeTime();
    }
    if (movementSpeedInterval) {
        stopMovementSpeed();
    }
    if (devPanel) {
        closeDevPanel();
    }
});

alt.on('keydown', (key) => {
    if (key === 113) {
        toggleDevPanel();
    }
    
    if (key === 27 && isDevPanelOpen) {
        closeDevPanel();
    }
    
    if (key === 114) {
        alt.emitServer(DEV_EVENTS.TOGGLE_NOCLIP);
    }
    
    if (key === 115) {
        alt.emitServer(DEV_EVENTS.TOGGLE_GODMODE);
    }
    
    if (key === 116) {
        alt.emitServer(DEV_EVENTS.TOGGLE_INVISIBLE);
    }
    
    if (key === 117) {
        alt.emitServer(DEV_EVENTS.TOGGLE_SUPER_JUMP);
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

alt.onServer('dev:invisibleState', (enabled) => {
    isInvisibleEnabled = enabled;
    alt.log(`[DEV] Invisible ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        startInvisible();
    } else {
        stopInvisible();
    }
});

alt.onServer('dev:superJumpState', (enabled) => {
    isSuperJumpEnabled = enabled;
    alt.log(`[DEV] Super Jump ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        startSuperJump();
    } else {
        stopSuperJump();
    }
});

alt.onServer('dev:freezeTimeState', (enabled) => {
    isTimeFreezed = enabled;
    alt.log(`[DEV] Time Freeze ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        startFreezeTime();
    } else {
        stopFreezeTime();
    }
});

alt.onServer('dev:infiniteAmmoState', (enabled) => {
    infiniteAmmoEnabled = enabled;
    alt.log(`[DEV] Infinite Ammo ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        startInfiniteAmmo();
    } else {
        stopInfiniteAmmo();
    }
});

alt.onServer('dev:movementSpeedChanged', (speed) => {
    movementSpeed = speed;
    alt.log(`[DEV] Movement speed changed to ${speed}`);
    
    if (!movementSpeedInterval && speed !== 1.0) {
        startMovementSpeed();
    } else if (movementSpeedInterval && speed === 1.0) {
        stopMovementSpeed();
    }
});

alt.onServer('dev:createExplosion', (x, y, z) => {
    native.addExplosion(x, y, z, 1, 10.0, true, false, 1.0, 0);
    alt.log(`[DEV] Explosion created at ${x}, ${y}, ${z}`);
});

alt.onServer('dev:waypointPos', (x, y, z) => {
    if (devPanel) {
        const message = `Waypoint: ${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`;
        devPanel.emit('showNotification', message, 'info');
    }
});

alt.onServer('dev:getWaypointCoords', () => {
    const waypointBlip = native.getFirstBlipInfoId(8);
    if (waypointBlip && native.doesBlipExist(waypointBlip)) {
        const coords = native.getBlipInfoIdCoord(waypointBlip);
        
        let finalZ = coords.z;
        let foundGround = false;
        
        const groundZResult = native.getGroundZFor3dCoord(coords.x, coords.y, 1000.0, 0, false, false);
        if (groundZResult[0]) {
            finalZ = groundZResult[1] + 1.5;
            foundGround = true;
        }
        
        if (!foundGround) {
            const groundZResult2 = native.getGroundZFor3dCoord(coords.x, coords.y, 500.0, 0, true, false);
            if (groundZResult2[0]) {
                finalZ = groundZResult2[1] + 1.5;
                foundGround = true;
            }
        }
        
        if (!foundGround) {
            for (let testHeight = 200; testHeight >= -50; testHeight -= 25) {
                const groundZResult3 = native.getGroundZFor3dCoord(coords.x, coords.y, testHeight, 0, false, false);
                if (groundZResult3[0]) {
                    finalZ = groundZResult3[1] + 1.5;
                    foundGround = true;
                    break;
                }
            }
        }
        
        if (!foundGround) {
            if (coords.x >= -3000 && coords.x <= 4000 && coords.y >= -4000 && coords.y <= 8000) {
                finalZ = 30.0;
            } else {
                finalZ = 100.0;
            }
        }
        
        if (finalZ < -200.0) finalZ = 30.0;
        if (finalZ > 2000.0) finalZ = 200.0;
        
        alt.emitServer('dev:waypointCoords', coords.x, coords.y, finalZ);
    } else {
        alt.emitServer('dev:waypointCoords', null, null, null);
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
    
    devPanel.on('dev:teleportToWaypoint', () => {
        alt.emitServer(DEV_EVENTS.TELEPORT_TO_WAYPOINT);
    });
    
    devPanel.on('dev:toggleInvisible', () => {
        alt.emitServer(DEV_EVENTS.TOGGLE_INVISIBLE);
    });
    
    devPanel.on('dev:toggleSuperJump', () => {
        alt.emitServer(DEV_EVENTS.TOGGLE_SUPER_JUMP);
    });
    
    devPanel.on('dev:setMovementSpeed', (speed) => {
        movementSpeed = speed;
        alt.emitServer(DEV_EVENTS.SET_MOVEMENT_SPEED, speed);
    });
    
    devPanel.on('dev:toggleFreezeTime', () => {
        alt.emitServer(DEV_EVENTS.TOGGLE_FREEZE_TIME);
    });
    
    devPanel.on('dev:savePosition', (name) => {
        const pos = alt.Player.local.pos;
        savedPositions[name] = pos;
        alt.emitServer(DEV_EVENTS.SAVE_POSITION, name, pos.x, pos.y, pos.z);
    });
    
    devPanel.on('dev:loadPosition', (name) => {
        if (savedPositions[name]) {
            const pos = savedPositions[name];
            alt.emitServer(DEV_EVENTS.TELEPORT, pos.x, pos.y, pos.z);
        }
    });
    
    devPanel.on('dev:createExplosion', () => {
        const pos = alt.Player.local.pos;
        alt.emitServer(DEV_EVENTS.CREATE_EXPLOSION, pos.x, pos.y, pos.z);
    });
    
    devPanel.on('dev:healAllPlayers', () => {
        alt.emitServer(DEV_EVENTS.HEAL_ALL_PLAYERS);
    });
    
    devPanel.on('dev:infiniteAmmo', () => {
        alt.emitServer(DEV_EVENTS.INFINITE_AMMO);
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
            invisible: isInvisibleEnabled,
            superJump: isSuperJumpEnabled,
            freezeTime: isTimeFreezed,
            infiniteAmmo: infiniteAmmoEnabled,
            movementSpeed: movementSpeed,
            savedPositions: Object.keys(savedPositions),
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
        let newPos = { ...playerPos };
        
        const baseSpeed = native.isControlPressed(0, 21) ? 2.0 : 0.5;
        const speed = baseSpeed * movementSpeed;
        
        const camRot = native.getGameplayCamRot(2);
        const pitch = camRot.x * (Math.PI / 180);
        const yaw = camRot.z * (Math.PI / 180);
        
        const forwardX = -Math.sin(yaw) * Math.cos(pitch);
        const forwardY = Math.cos(yaw) * Math.cos(pitch);
        const forwardZ = Math.sin(pitch);
        
        const rightX = Math.cos(yaw);
        const rightY = Math.sin(yaw);
        
        if (native.isControlPressed(0, 32)) {
            newPos.x += forwardX * speed;
            newPos.y += forwardY * speed;
            newPos.z += forwardZ * speed;
        }
        if (native.isControlPressed(0, 33)) {
            newPos.x -= forwardX * speed;
            newPos.y -= forwardY * speed;
            newPos.z -= forwardZ * speed;
        }
        if (native.isControlPressed(0, 34)) {
            newPos.x -= rightX * speed;
            newPos.y -= rightY * speed;
        }
        if (native.isControlPressed(0, 35)) {
            newPos.x += rightX * speed;
            newPos.y += rightY * speed;
        }
        if (native.isControlPressed(0, 22)) {
            newPos.z += speed;
        }
        if (native.isControlPressed(0, 36)) {
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

let invisibleInterval = null;

function startInvisible() {
    if (invisibleInterval) return;
    
    invisibleInterval = alt.setInterval(() => {
        if (!isInvisibleEnabled) return;
        
        const localPlayer = alt.Player.local;
        native.setEntityVisible(localPlayer.scriptID, false, false);
        native.setEntityAlpha(localPlayer.scriptID, 0, false);
    }, 100);
}

function stopInvisible() {
    if (invisibleInterval) {
        alt.clearInterval(invisibleInterval);
        invisibleInterval = null;
    }
    
    const localPlayer = alt.Player.local;
    native.setEntityVisible(localPlayer.scriptID, true, false);
    native.setEntityAlpha(localPlayer.scriptID, 255, false);
}

let superJumpInterval = null;
let lastJumpTime = 0;

function startSuperJump() {
    if (superJumpInterval) return;
    
    superJumpInterval = alt.setInterval(() => {
        if (!isSuperJumpEnabled) return;
        
        const localPlayer = alt.Player.local;
        const currentTime = Date.now();
        
        if (native.isControlJustPressed(0, 22)) {
            if (currentTime - lastJumpTime > 500) {
                const currentVelocity = native.getEntityVelocity(localPlayer.scriptID);
                
                native.setEntityVelocity(
                    localPlayer.scriptID, 
                    currentVelocity.x, 
                    currentVelocity.y, 
                    currentVelocity.z + 15.0
                );
                
                lastJumpTime = currentTime;
            }
        }
    }, 0);
}

function stopSuperJump() {
    if (superJumpInterval) {
        alt.clearInterval(superJumpInterval);
        superJumpInterval = null;
    }
}

let infiniteAmmoInterval = null;

function startInfiniteAmmo() {
    if (infiniteAmmoInterval) return;
    
    infiniteAmmoInterval = alt.setInterval(() => {
        if (!infiniteAmmoEnabled) return;
        
        const localPlayer = alt.Player.local;
        let weaponHash = 0;
        
        const currentWeapon = native.getCurrentPedWeapon(localPlayer.scriptID, weaponHash, true);
        
        if (currentWeapon[0] && currentWeapon[1] !== 0) {
            weaponHash = currentWeapon[1];
            
            native.setAmmoInClip(localPlayer.scriptID, weaponHash, 9999);
            native.setPedAmmo(localPlayer.scriptID, weaponHash, 9999, true);
            
            native.setPedInfiniteAmmoClip(localPlayer.scriptID, true);
        }
    }, 100);
}

function stopInfiniteAmmo() {
    if (infiniteAmmoInterval) {
        alt.clearInterval(infiniteAmmoInterval);
        infiniteAmmoInterval = null;
    }
    
    const localPlayer = alt.Player.local;
    native.setPedInfiniteAmmoClip(localPlayer.scriptID, false);
}

let freezeTimeInterval = null;
let originalHour = 12;
let originalMinute = 0;

function startFreezeTime() {
    if (freezeTimeInterval) return;
    
    originalHour = native.getClockHours();
    originalMinute = native.getClockMinutes();
    
    freezeTimeInterval = alt.setInterval(() => {
        if (!isTimeFreezed) return;
        
        native.setClockTime(originalHour, originalMinute, 0);
        
        native.setTimeScale(0.0);
    }, 50);
}

function stopFreezeTime() {
    if (freezeTimeInterval) {
        alt.clearInterval(freezeTimeInterval);
        freezeTimeInterval = null;
    }
    
    native.setTimeScale(1.0);
}

let movementSpeedInterval = null;

function startMovementSpeed() {
    if (movementSpeedInterval) return;
    
    movementSpeedInterval = alt.setInterval(() => {
        const localPlayer = alt.Player.local;
        
        if (native.isControlPressed(0, 32) ||
            native.isControlPressed(0, 33) ||
            native.isControlPressed(0, 34) ||
            native.isControlPressed(0, 35)) {
            
            if (movementSpeed !== 1.0) {
                const currentVelocity = native.getEntityVelocity(localPlayer.scriptID);
                const baseSpeed = 5.0;
                
                const playerRot = localPlayer.rot;
                const forwardX = -Math.sin(playerRot.z);
                const forwardY = Math.cos(playerRot.z);
                const rightX = Math.cos(playerRot.z);
                const rightY = Math.sin(playerRot.z);
                
                let moveX = 0, moveY = 0;
                
                if (native.isControlPressed(0, 32)) {
                    moveX += forwardX;
                    moveY += forwardY;
                }
                if (native.isControlPressed(0, 33)) {
                    moveX -= forwardX;
                    moveY -= forwardY;
                }
                if (native.isControlPressed(0, 34)) {
                    moveX -= rightX;
                    moveY -= rightY;
                }
                if (native.isControlPressed(0, 35)) {
                    moveX += rightX;
                    moveY += rightY;
                }
                
                const length = Math.sqrt(moveX * moveX + moveY * moveY);
                if (length > 0) {
                    moveX /= length;
                    moveY /= length;
                    
                    const finalSpeed = baseSpeed * movementSpeed;
                    
                    native.setEntityVelocity(
                        localPlayer.scriptID,
                        moveX * finalSpeed,
                        moveY * finalSpeed,
                        currentVelocity.z
                    );
                }
            }
        }
    }, 0);
}

function stopMovementSpeed() {
    if (movementSpeedInterval) {
        alt.clearInterval(movementSpeedInterval);
        movementSpeedInterval = null;
    }
} 
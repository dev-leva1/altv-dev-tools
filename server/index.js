import alt from 'alt-server';
import { DEV_EVENTS, VEHICLES, WEATHER_TYPES, TELEPORT_LOCATIONS } from '../shared/index.js';

const playerStates = new Map();

alt.on('resourceStart', () => {
    alt.log('[DEV] Development tools resource started');
    alt.log('[DEV] Available commands: /dev, /noclip, /tp, /car, /heal, /god');
});

alt.on('playerConnect', (player) => {
    playerStates.set(player.id, {
        noclip: false,
        godmode: false,
        vehicleInfo: false,
        invisible: false,
        superJump: false,
        freezeTime: false,
        infiniteAmmo: false,
        movementSpeed: 1.0,
        spawnedVehicles: [],
        savedPositions: {},
        lastPos: { x: 0, y: 0, z: 0 }
    });
    
    alt.log(`[DEV] Player ${player.name} connected - dev tools initialized`);
});

alt.on('playerDisconnect', (player) => {
    playerStates.delete(player.id);
});

alt.on('consoleCommand', (name, ...args) => {
    switch(name) {
        case 'dev':
            handleDevPanel();
            break;
        case 'noclip':
            if (args[0]) {
                const targetPlayer = alt.Player.all.find(p => p.name === args[0]);
                if (targetPlayer) {
                    toggleNoclip(targetPlayer);
                }
            }
            break;
        case 'tp':
            if (args.length >= 3) {
                const x = parseFloat(args[0]);
                const y = parseFloat(args[1]);
                const z = parseFloat(args[2]);
                teleportAllPlayers(x, y, z);
            }
            break;
        case 'car':
            if (args[0]) {
                spawnVehicleForAll(args[0]);
            }
            break;
        case 'heal':
            healAllPlayers();
            break;
        case 'god':
            toggleGodmodeAll();
            break;
    }
});

alt.onClient(DEV_EVENTS.TOGGLE_NOCLIP, (player) => {
    alt.log(`[DEV] Received TOGGLE_NOCLIP from ${player.name}`);
    toggleNoclip(player);
});

alt.onClient(DEV_EVENTS.TELEPORT, (player, x, y, z) => {
    if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
        player.pos = { x, y, z };
        alt.log(`[DEV] ${player.name} teleported to ${x}, ${y}, ${z}`);
    }
});

alt.onClient(DEV_EVENTS.SET_HEALTH, (player, health) => {
    alt.log(`[DEV] Received health value: ${health}, type: ${typeof health}`);
    if (typeof health === 'number' && health >= 0 && health <= 100) {
        const altVHealth = 100 + health;
        player.health = altVHealth;
        alt.log(`[DEV] ${player.name} health set to ${health}% (${altVHealth} alt:V health)`);
    } else {
        alt.logError(`[DEV] Invalid health value: ${health} (type: ${typeof health})`);
    }
});

alt.onClient(DEV_EVENTS.SET_ARMOUR, (player, armour) => {
    if (typeof armour === 'number' && armour >= 0 && armour <= 100) {
        player.armour = armour;
        alt.log(`[DEV] ${player.name} armour set to ${armour}`);
    }
});

alt.onClient(DEV_EVENTS.SPAWN_VEHICLE, (player, model) => {
    if (typeof model === 'string' && model.length > 0) {
        try {
            const vehicle = new alt.Vehicle(model, player.pos.x + 2, player.pos.y, player.pos.z, 0, 0, 0);

            const state = playerStates.get(player.id);
            if (state) {
                state.spawnedVehicles.push(vehicle);
            }

            alt.setTimeout(() => {
                if (vehicle && vehicle.valid) {
                    player.setIntoVehicle(vehicle, 1);
                }
            }, 100);
            
            alt.log(`[DEV] ${player.name} spawned vehicle: ${model}`);
        } catch (error) {
            alt.logError(`[DEV] Failed to spawn vehicle ${model}: ${error.message}`);
        }
    }
});

alt.onClient(DEV_EVENTS.TOGGLE_GODMODE, (player) => {
    alt.log(`[DEV] Received TOGGLE_GODMODE from ${player.name}`);
    toggleGodmode(player);
});

alt.onClient(DEV_EVENTS.SET_WEATHER, (player, weather) => {
    if (WEATHER_TYPES.includes(weather)) {
        alt.Player.all.forEach(p => {
            p.setWeather(weather);
        });
        alt.log(`[DEV] Weather changed to ${weather} by ${player.name}`);
    }
});

alt.onClient(DEV_EVENTS.SET_TIME, (player, hour, minute) => {
    if (typeof hour === 'number' && typeof minute === 'number') {
        alt.Player.all.forEach(p => {
            p.setDateTime(2023, 1, 1, hour, minute, 0);
        });
        alt.log(`[DEV] Time changed to ${hour}:${minute} by ${player.name}`);
    }
});

alt.onClient(DEV_EVENTS.GET_PERFORMANCE, (player) => {
    const performance = {
        players: alt.Player.all.length,
        vehicles: alt.Vehicle.all.length,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    };
    
    player.emit('dev:performanceData', performance);
});

alt.onClient(DEV_EVENTS.GET_PLAYERS, (player) => {
    const players = alt.Player.all.map(p => ({
        id: p.id,
        name: p.name,
        pos: p.pos,
        health: p.health,
        armour: p.armour,
        ping: p.ping
    }));
    
    player.emit('dev:playersData', players);
});

alt.onClient(DEV_EVENTS.TELEPORT_TO_PLAYER, (player, targetId) => {
    const target = alt.Player.getByID(targetId);
    if (target && target.valid) {
        player.pos = target.pos;
        alt.log(`[DEV] ${player.name} teleported to ${target.name}`);
    }
});

alt.onClient(DEV_EVENTS.BRING_PLAYER, (player, targetId) => {
    const target = alt.Player.getByID(targetId);
    if (target && target.valid) {
        target.pos = player.pos;
        alt.log(`[DEV] ${target.name} brought to ${player.name}`);
    }
});

alt.onClient(DEV_EVENTS.DELETE_ALL_VEHICLES, (player) => {
    alt.log(`[DEV] Received DELETE_ALL_VEHICLES from ${player.name}`);
    const vehicleCount = alt.Vehicle.all.length;
    alt.log(`[DEV] Found ${vehicleCount} vehicles to delete`);
    
    try {
        let deletedCount = 0;
        alt.Vehicle.all.forEach(vehicle => {
            if (vehicle && vehicle.valid) {
                vehicle.destroy();
                deletedCount++;
            }
        });

        playerStates.forEach(state => {
            state.spawnedVehicles = [];
        });
        
        alt.log(`[DEV] ${player.name} deleted all vehicles (${deletedCount}/${vehicleCount} vehicles)`);

        player.emit('dev:deleteAllVehiclesResult', {
            success: true,
            count: deletedCount
        });
    } catch (error) {
        alt.logError(`[DEV] Error deleting all vehicles: ${error.message}`);
        player.emit('dev:deleteAllVehiclesResult', {
            success: false,
            error: error.message
        });
    }
});

alt.onClient(DEV_EVENTS.DELETE_SPAWNED_VEHICLES, (player) => {
    alt.log(`[DEV] Received DELETE_SPAWNED_VEHICLES from ${player.name}`);
    
    try {
        let deletedCount = 0;
        let totalSpawned = 0;
        
        playerStates.forEach(state => {
            totalSpawned += state.spawnedVehicles.length;
            state.spawnedVehicles.forEach(vehicle => {
                if (vehicle && vehicle.valid) {
                    vehicle.destroy();
                    deletedCount++;
                }
            });
            state.spawnedVehicles = [];
        });
        
        alt.log(`[DEV] ${player.name} deleted spawned vehicles (${deletedCount}/${totalSpawned} vehicles)`);

        player.emit('dev:deleteSpawnedVehiclesResult', {
            success: true,
            count: deletedCount
        });
    } catch (error) {
        alt.logError(`[DEV] Error deleting spawned vehicles: ${error.message}`);
        player.emit('dev:deleteSpawnedVehiclesResult', {
            success: false,
            error: error.message
        });
    }
});

alt.onClient(DEV_EVENTS.TOGGLE_VEHICLE_INFO, (player) => {
    toggleVehicleInfo(player);
});

alt.onClient(DEV_EVENTS.TELEPORT_TO_WAYPOINT, (player) => {
    player.emit('dev:getWaypointCoords');
});

alt.onClient('dev:waypointCoords', (player, x, y, z) => {
    if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
        player.pos = { x, y, z };
        player.emit('dev:waypointPos', x, y, z);
        alt.log(`[DEV] ${player.name} teleported to waypoint at ${x}, ${y}, ${z}`);
    } else {
        alt.log(`[DEV] No waypoint found for ${player.name}`);
    }
});

alt.onClient(DEV_EVENTS.TOGGLE_INVISIBLE, (player) => {
    toggleInvisible(player);
});

alt.onClient(DEV_EVENTS.TOGGLE_SUPER_JUMP, (player) => {
    toggleSuperJump(player);
});

alt.onClient(DEV_EVENTS.SET_MOVEMENT_SPEED, (player, speed) => {
    if (typeof speed === 'number' && speed >= 0.1 && speed <= 5.0) {
        const state = playerStates.get(player.id);
        if (state) {
            state.movementSpeed = speed;
            player.emit('dev:movementSpeedChanged', speed);
            alt.log(`[DEV] Movement speed set to ${speed} for ${player.name}`);
        }
    }
});

alt.onClient(DEV_EVENTS.TOGGLE_FREEZE_TIME, (player) => {
    toggleFreezeTime(player);
});

alt.onClient(DEV_EVENTS.SAVE_POSITION, (player, name, x, y, z) => {
    if (typeof name === 'string' && name.length > 0) {
        const state = playerStates.get(player.id);
        if (state) {
            state.savedPositions[name] = { x, y, z };
            alt.log(`[DEV] Position '${name}' saved for ${player.name} at ${x}, ${y}, ${z}`);
        }
    }
});

alt.onClient(DEV_EVENTS.CREATE_EXPLOSION, (player, x, y, z) => {
    alt.Player.all.forEach(p => {
        p.emit('dev:createExplosion', x, y, z);
    });
    alt.log(`[DEV] Explosion created by ${player.name} at ${x}, ${y}, ${z}`);
});

alt.onClient(DEV_EVENTS.HEAL_ALL_PLAYERS, (player) => {
    healAllPlayers();
    alt.log(`[DEV] All players healed by ${player.name}`);
});

alt.onClient(DEV_EVENTS.INFINITE_AMMO, (player) => {
    toggleInfiniteAmmo(player);
});

function toggleNoclip(player) {
    const state = playerStates.get(player.id);
    if (state) {
        state.noclip = !state.noclip;
        player.emit('dev:noclipState', state.noclip);
        alt.log(`[DEV] Noclip ${state.noclip ? 'enabled' : 'disabled'} for ${player.name}`);
    } else {
        alt.logError(`[DEV] Player state not found for ${player.name} (ID: ${player.id})`);
        playerStates.set(player.id, {
            noclip: true,
            godmode: false,
            vehicleInfo: false,
            spawnedVehicles: [],
            lastPos: { x: 0, y: 0, z: 0 }
        });
        player.emit('dev:noclipState', true);
        alt.log(`[DEV] Noclip enabled for ${player.name} (state recreated)`);
    }
}

function toggleGodmode(player) {
    const state = playerStates.get(player.id);
    if (state) {
        state.godmode = !state.godmode;
        player.invincible = state.godmode;
        player.emit('dev:godmodeState', state.godmode);
        alt.log(`[DEV] Godmode ${state.godmode ? 'enabled' : 'disabled'} for ${player.name}`);
    } else {
        alt.logError(`[DEV] Player state not found for ${player.name} (ID: ${player.id})`);
        playerStates.set(player.id, {
            noclip: false,
            godmode: true,
            vehicleInfo: false,
            spawnedVehicles: [],
            lastPos: { x: 0, y: 0, z: 0 }
        });
        player.invincible = true;
        player.emit('dev:godmodeState', true);
        alt.log(`[DEV] Godmode enabled for ${player.name} (state recreated)`);
    }
}

function handleDevPanel() {
    alt.Player.all.forEach(player => {
        player.emit('dev:openPanel');
    });
    alt.log('[DEV] Development panel opened for all players');
}

function teleportAllPlayers(x, y, z) {
    alt.Player.all.forEach(player => {
        player.pos = { x, y, z };
    });
    alt.log(`[DEV] All players teleported to ${x}, ${y}, ${z}`);
}

function spawnVehicleForAll(model) {
    alt.Player.all.forEach(player => {
        try {
            const vehicle = new alt.Vehicle(model, player.pos.x + 2, player.pos.y, player.pos.z, 0, 0, 0);

            alt.setTimeout(() => {
                if (vehicle && vehicle.valid) {
                    alt.log(`[DEV] Vehicle ${model} spawned near ${player.name}`);
                }
            }, 100);
        } catch (error) {
            alt.logError(`[DEV] Failed to spawn vehicle ${model} for ${player.name}: ${error.message}`);
        }
    });
}

function healAllPlayers() {
    alt.Player.all.forEach(player => {
        player.health = 200;
        player.armour = 100;
    });
    alt.log('[DEV] All players healed');
}

function toggleGodmodeAll() {
    alt.Player.all.forEach(player => {
        toggleGodmode(player);
    });
}

function toggleVehicleInfo(player) {
    const state = playerStates.get(player.id);
    if (state) {
        state.vehicleInfo = !state.vehicleInfo;
        player.emit('dev:vehicleInfoState', state.vehicleInfo);
        alt.log(`[DEV] Vehicle Info ${state.vehicleInfo ? 'enabled' : 'disabled'} for ${player.name}`);
    } else {
        alt.logError(`[DEV] Player state not found for ${player.name} (ID: ${player.id})`);
        playerStates.set(player.id, {
            noclip: false,
            godmode: false,
            vehicleInfo: true,
            spawnedVehicles: [],
            lastPos: { x: 0, y: 0, z: 0 }
        });
        player.emit('dev:vehicleInfoState', true);
        alt.log(`[DEV] Vehicle Info enabled for ${player.name} (state recreated)`);
    }
}

function toggleInvisible(player) {
    const state = playerStates.get(player.id);
    if (state) {
        state.invisible = !state.invisible;
        player.emit('dev:invisibleState', state.invisible);
        alt.log(`[DEV] Invisible ${state.invisible ? 'enabled' : 'disabled'} for ${player.name}`);
    }
}

function toggleSuperJump(player) {
    const state = playerStates.get(player.id);
    if (state) {
        state.superJump = !state.superJump;
        player.emit('dev:superJumpState', state.superJump);
        alt.log(`[DEV] Super Jump ${state.superJump ? 'enabled' : 'disabled'} for ${player.name}`);
    }
}

function toggleFreezeTime(player) {
    const state = playerStates.get(player.id);
    if (state) {
        state.freezeTime = !state.freezeTime;
        
        alt.Player.all.forEach(p => {
            p.emit('dev:freezeTimeState', state.freezeTime);
        });
        
        alt.log(`[DEV] Time Freeze ${state.freezeTime ? 'enabled' : 'disabled'} by ${player.name}`);
    }
}

function toggleInfiniteAmmo(player) {
    const state = playerStates.get(player.id);
    if (state) {
        state.infiniteAmmo = !state.infiniteAmmo;
        player.emit('dev:infiniteAmmoState', state.infiniteAmmo);
        alt.log(`[DEV] Infinite Ammo ${state.infiniteAmmo ? 'enabled' : 'disabled'} for ${player.name}`);
    }
} 
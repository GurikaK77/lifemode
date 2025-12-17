import { state, shopItems, allSports, bossDefinitions, achievements } from './data.js';
import * as UI from './ui.js';
import * as AI from './ai.js';

window.startAiSession = startAiSession;
window.stopAiSession = stopAiSession;

export function saveData() {
    localStorage.setItem('xp', state.xp);
    localStorage.setItem('coins', state.coins);
    localStorage.setItem('level', state.level);
    localStorage.setItem('muscles', JSON.stringify(state.muscles));
    localStorage.setItem('inventory', JSON.stringify(state.inventory));
    localStorage.setItem('userName', state.userName);
    localStorage.setItem('userAvatar', state.userAvatar);
    localStorage.setItem('userSports', JSON.stringify(state.userSports));
    localStorage.setItem('theme', state.currentTheme);
    localStorage.setItem('ownedThemes', JSON.stringify(state.ownedThemes));
    localStorage.setItem('lastWorkoutTime', state.lastWorkoutTime);
    localStorage.setItem('activeBet', JSON.stringify(state.activeBet));
    localStorage.setItem('activityLog', JSON.stringify(state.activityLog));
    localStorage.setItem('xpHistory', JSON.stringify(state.xpHistory));
    localStorage.setItem('ownedGear', JSON.stringify(state.ownedGear));
    localStorage.setItem('unlockedAchievements', JSON.stringify(state.unlockedAchievements));
    localStorage.setItem('stats', JSON.stringify(state.stats));
    localStorage.setItem('routine', JSON.stringify(state.routine));
    if(state.currentBoss) localStorage.setItem('currentBoss', JSON.stringify(state.currentBoss));
}

export function generateAiRoutine() {
    const busyStart = document.getElementById('busyStart').value;
    const busyEnd = document.getElementById('busyEnd').value;
    const workoutStart = document.getElementById('workoutStart').value;
    const workoutEnd = document.getElementById('workoutEnd').value;
    const isRest = document.getElementById('restDayToggle').checked;

    state.routine.busyStart = busyStart;
    state.routine.busyEnd = busyEnd;
    state.routine.workoutStart = workoutStart;
    state.routine.workoutEnd = workoutEnd;
    state.routine.isRestDay = isRest;
    state.routine.lastGenerated = new Date().toDateString();
    state.routine.active = true;
    state.routine.tasks = [];

    state.routine.tasks.push({ time: "08:00", title: "გაღვიძება & წყალი", type: "habit", xp: 10, completed: false });

    if(busyStart && busyEnd) {
        state.routine.tasks.push({ time: busyStart, title: "სკოლა / სამსახური", type: "busy", duration: `${busyStart}-${busyEnd}`, completed: true }); 
    }

    if (isRest) {
        state.routine.tasks.push({ time: "12:00", title: "დასვენება & აღდგენა", type: "rest", xp: 50, completed: false });
    } else {
        const availableSports = allSports.filter(s => state.userSports.includes(s.id));
        let timeCursor = new Date(`2000-01-01T${workoutStart}`);
        const endTime = new Date(`2000-01-01T${workoutEnd}`);

        while (timeCursor < endTime) {
            const sport = availableSports[Math.floor(Math.random() * availableSports.length)];
            const hours = timeCursor.getHours().toString().padStart(2, '0');
            const minutes = timeCursor.getMinutes().toString().padStart(2, '0');
            
            let amount = sport.unit === 'სთ' ? '30 წთ' : (Math.floor(Math.random() * 3 + 2) * 10) + ' ცალი';
            let xpVal = Math.floor(sport.xp / 2);

            state.routine.tasks.push({ 
                time: `${hours}:${minutes}`, 
                title: `${sport.name} - ${amount}`, 
                type: 'workout', 
                xp: xpVal, 
                completed: false 
            });

            timeCursor.setMinutes(timeCursor.getMinutes() + 30);
        }
    }

    state.routine.tasks.push({ time: "22:00", title: "ძილის წინ: გაწელვა", type: "habit", xp: 20, completed: false });

    saveData();
    UI.showToast("📅 განრიგი შედგენილია!", "success");
    UI.renderRoutinePage();
}

export function completeRoutineTask(index) {
    const task = state.routine.tasks[index];
    if (task.completed) return;
    
    task.completed = true;
    state.xp += task.xp;
    state.coins += Math.floor(task.xp / 2);
    state.stats.routineTasksDone++;

    UI.SoundFX.success();
    UI.triggerConfetti();
    UI.showToast(`✅ შესრულებულია: +${task.xp} XP`);
    checkLevelUp();
    checkAchievements();
    saveData();
    UI.renderRoutinePage();
    UI.updateUI();
}

export function resetRoutine() {
    if(confirm("გინდა თავიდან შეადგინო განრიგი?")) {
        state.routine.active = false;
        saveData();
        UI.renderRoutinePage();
    }
}

export function setupInput(id) { 
    let act = allSports.find(a => a.id === id);
    if(!act) return;
    state.selectedActivity = act; 
    
    document.getElementById('inputModal').style.display = 'flex'; 
    const input = document.getElementById('workoutInput');
    input.value = ''; input.focus(); 
    
    document.getElementById('inputTitle').innerText = act.name;
    document.getElementById('inputUnit').innerText = (act.unit === 'სთ' ? 'საათი' : (act.unit === 'წთ' ? 'წუთი' : 'რაოდენობა'));
    document.getElementById('btnAiCam').style.display = act.aiSupported ? 'block' : 'none';
}

export function startAiSession() {
    UI.closeModal('inputModal');
    document.getElementById('aiOverlay').style.display = 'flex';
    AI.startCamera();
}

export function stopAiSession() {
    const result = AI.stopCamera();
    document.getElementById('aiOverlay').style.display = 'none';
    setupInput(state.selectedActivity.id);
    document.getElementById('workoutInput').value = result;
    UI.showToast(`დათვლილია: ${result}`, "success");
}

export function confirmWorkout() {
    const amount = parseFloat(document.getElementById('workoutInput').value);
    if (!amount || amount <= 0) { UI.SoundFX.error(); UI.showToast("შეიყვანე რაოდენობა!", "error"); return; }
    
    const act = state.selectedActivity;
    let xpGained = Math.round(act.xp * amount);
    
    let gearMultiplier = 1;
    state.ownedGear.forEach(gearId => {
        const item = shopItems.gear.find(g => g.id === gearId);
        if (item) {
            if (item.type === 'global' || item.type === act.id) gearMultiplier += item.val;
        }
    });
    xpGained = Math.round(xpGained * gearMultiplier);

    if (state.activeEffects.xpMultiplier > 1) {
        xpGained = Math.round(xpGained * state.activeEffects.xpMultiplier);
        state.activeEffects.xpMultiplier = 1; 
        UI.showToast("⚡ ბუსტი გამოყენებულია!", "success");
    }

    if(act.muscles) {
        for(let mKey in act.muscles) {
            if(state.muscles[mKey]) state.muscles[mKey].energy -= (act.muscles[mKey] * amount);
            if(state.muscles[mKey].energy < 0) state.muscles[mKey].energy = 0;
        }
    }

    state.xp += xpGained;
    state.coins += xpGained;
    state.lastWorkoutTime = Date.now();

    checkBetProgress(xpGained);
    damageBoss(xpGained * 0.5);
    addToLog(act.name, amount, xpGained);
    updateHistory(xpGained);
    
    checkLevelUp(); saveData(); UI.renderBody(); UI.updateUI(); 
    UI.closeModal('inputModal'); UI.SoundFX.success();
}

export function calculatePassiveRecovery() {
    const now = Date.now();
    const lastWorkout = state.lastWorkoutTime || 0;
    const cooldownMs = 1 * 60 * 60 * 1000; 

    if (now > lastWorkout + cooldownMs) {
        let changed = false;
        for (let key in state.muscles) {
            if (state.muscles[key].energy < 100) {
                state.muscles[key].energy += 5; 
                if (state.muscles[key].energy > 100) state.muscles[key].energy = 100;
                changed = true;
            }
        }
        if (changed) { saveData(); UI.renderBody(); }
    }
}

function checkBetProgress(gainedXp) {
    if(!state.activeBet) return;
    if(Date.now() > state.activeBet.endTime) {
        UI.showToast("❌ ფსონის დრო გავიდა. წააგე!", "error"); state.activeBet = null; saveData(); UI.updateUI(); return;
    }
    state.activeBet.currentXp += gainedXp;
    if(state.activeBet.currentXp >= state.activeBet.targetXp) {
        const reward = state.activeBet.amount * 2; state.coins += reward;
        state.stats.betsWon++; 
        UI.SoundFX.levelUp(); UI.triggerConfetti(); UI.showToast(`🎰 მოიგე ფსონი! +${reward} ოქრო`, "success");
        state.activeBet = null; checkAchievements(); saveData(); UI.updateUI();
    }
}

function addToLog(name, amount, xpVal) { 
    const now = new Date(); 
    const timeStr = now.getHours() + ':' + (now.getMinutes()<10?'0':'') + now.getMinutes(); 
    state.activityLog.unshift({ date: 'დღეს', time: timeStr, name: name, desc: amount, xp: xpVal }); 
    if(state.activityLog.length > 10) state.activityLog.pop(); 
    UI.renderLog(); 
}

function updateHistory(amount) { 
    let todayIndex = state.xpHistory.length - 1; 
    state.xpHistory[todayIndex].val += amount; 
    UI.renderChart(); 
}

function checkLevelUp() { 
    let calculatedLevel = Math.floor(state.xp / 1000) + 1; 
    if (calculatedLevel > state.level) { 
        state.level = calculatedLevel; UI.SoundFX.levelUp(); UI.triggerConfetti(); 
        UI.showToast(`🎉 Level Up: ${state.level}!`, "success"); 
        checkAchievements();
        UI.updateProfileUI(); 
    } 
}

function damageBoss(dmg) {
    if(!state.currentBoss) return;
    state.currentBoss.hp -= dmg;
    if(state.currentBoss.hp <= 0) {
        state.currentBoss.hp = 0; state.coins += state.currentBoss.reward;
        state.bossTrophies.push({ name: state.currentBoss.name, icon: state.currentBoss.icon });
        UI.showToast(`⚔️ ბოსი დამარცხდა! +${state.currentBoss.reward} ოქრო`, 'success');
        UI.SoundFX.levelUp(); UI.triggerConfetti(); checkAchievements(); setTimeout(initBoss, 2000); 
    } else { UI.SoundFX.attack(); }
    UI.updateBossUI();
}

export function checkAchievements() {
    achievements.forEach(ach => {
        if(!state.unlockedAchievements.includes(ach.id) && ach.condition(state)) {
            state.unlockedAchievements.push(ach.id);
            state.coins += ach.reward;
            UI.showToast(`🏆 მიღწევა: ${ach.name}`, "success");
        }
    });
}

export function initBoss() {
    if(!state.currentBoss || state.currentBoss.hp <= 0) {
        const rand = bossDefinitions[Math.floor(Math.random() * bossDefinitions.length)];
        state.currentBoss = { ...rand, maxHp: rand.baseHp * state.level, hp: rand.baseHp * state.level, reward: rand.reward * state.level };
        saveData();
    }
    UI.updateBossUI();
}

export function toggleSport(id) {
    if(state.userSports.includes(id)) {
        if(state.userSports.length > 1) state.userSports = state.userSports.filter(s => s !== id);
    } else { state.userSports.push(id); }
    UI.renderSportsSelector(); saveData();
}

export function buyItem(id, price, name) { 
    if(state.coins >= price) { 
        state.coins -= price; state.inventory[id] = (state.inventory[id] || 0) + 1; saveData(); 
        UI.openShop(); UI.updateUI(); UI.SoundFX.success(); 
    } else { UI.SoundFX.error(); UI.showToast("არაა საკმარისი ოქრო!", "error"); } 
}

export function buyTheme(id, price) {
    if(state.ownedThemes.includes(id)) { state.currentTheme = id; saveData(); UI.showToast("თემა დაყენებულია"); return; }
    if(state.coins >= price) {
        state.coins -= price; state.ownedThemes.push(id); state.currentTheme = id; saveData(); UI.openShop(); UI.showToast("თემა ნაყიდია!");
    }
}

export function buyGear(id, price) {
    if(state.ownedGear.includes(id)) return;
    if(state.coins >= price) { state.coins -= price; state.ownedGear.push(id); saveData(); UI.openShop(); UI.showToast("Gear ნაყიდია!"); }
}

export function useItem(id) { 
    if (id === 'protein_shake') { state.activeEffects.xpMultiplier = 1.5; UI.showToast("💪 +50% XP!"); }
    if (state.inventory[id] > 0) state.inventory[id]--; 
    saveData(); UI.openInventory(); 
}

export function openBetModal() { if(state.activeBet) { UI.showToast("უკვე გაქვს ფსონი"); return; } document.getElementById('betModal').style.display = 'flex'; }
export function placeBet() { 
    const val = parseInt(document.getElementById('betAmountInput').value); 
    if(state.coins >= val && val > 0) {
        state.coins -= val;
        state.activeBet = { amount: val, targetXp: 200, currentXp: 0, startTime: Date.now(), endTime: Date.now() + 86400000 };
        UI.closeModal('betModal'); saveData(); UI.updateUI();
    }
}
export function openSettingsMenu() { document.getElementById('settingsMenuModal').style.display = 'flex'; }
export function openProfileEdit() { document.getElementById('editProfileModal').style.display = 'flex'; }
export function openSportsEdit() { UI.renderSportsSelector(); document.getElementById('sportsModal').style.display = 'flex'; }
export function saveProfileChanges() { state.userName = document.getElementById('modalNameInput').value || state.userName; saveData(); UI.updateProfileUI(); UI.closeModal('editProfileModal'); }
export function openAvatarSelection() { 
    const g = document.getElementById('avatarGrid'); g.innerHTML = ''; 
    import('./data.js').then(d => d.avatars.forEach(a => g.innerHTML += `<div class="avatar-opt" onclick="window.selectAvatar('${a}')">${a}</div>`));
    document.getElementById('avatarModal').style.display = 'flex';
}
export function selectAvatar(av) { state.userAvatar = av; saveData(); UI.updateProfileUI(); UI.closeModal('avatarModal'); }
export function resetAllData() { localStorage.clear(); location.reload(); }

// SECRET CODE FIX: 'dzroxa'
export function checkSecretCode(v) { if(v==='dzroxa') document.getElementById('devMenu').style.display='block'; }

export function devAddCoins() { state.coins+=1000; saveData(); UI.updateUI(); }
export function devAddXp() { state.xp+=500; checkLevelUp(); saveData(); UI.updateUI(); }
export function devSetMuscle() { for(let k in state.muscles) state.muscles[k].energy=100; UI.renderBody(); }
export function devUnlockAll() { state.ownedThemes=['default','gold','red']; saveData(); }

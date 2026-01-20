import { state, shopItems, allSports, bossDefinitions, achievements, avatars } from './data.js';
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
    localStorage.setItem('lastWorkoutTime', state.lastWorkoutTime);
    localStorage.setItem('activeBet', JSON.stringify(state.activeBet));
    localStorage.setItem('activityLog', JSON.stringify(state.activityLog));
    localStorage.setItem('xpHistory', JSON.stringify(state.xpHistory));
    localStorage.setItem('lastBossAttack', state.lastBossAttack);
    localStorage.setItem('lastQuestTime', state.lastQuestTime);
    localStorage.setItem('dailyQuest', JSON.stringify(state.dailyQuest));
    localStorage.setItem('ownedGear', JSON.stringify(state.ownedGear));
    localStorage.setItem('unlockedAchievements', JSON.stringify(state.unlockedAchievements));
    localStorage.setItem('stats', JSON.stringify(state.stats));
    if(state.currentBoss) localStorage.setItem('currentBoss', JSON.stringify(state.currentBoss));
}

export function setupInput(id) { 
    let act = allSports.find(a => a.id === id);
    if(!act) return;
    state.selectedActivity = act; 
    
    document.getElementById('inputModal').style.display = 'flex'; 
    const input = document.getElementById('workoutInput');
    input.value = ''; 
    input.focus(); // Focus fix for mobile
    
    document.getElementById('inputTitle').innerText = act.name;
    document.getElementById('inputUnit').innerText = (act.unit === 'სთ' ? 'საათი' : (act.unit === 'წთ' ? 'წუთი' : 'რაოდენობა'));

    const btnAi = document.getElementById('btnAiCam');
    if (act.aiSupported) {
        btnAi.style.display = 'flex';
    } else {
        btnAi.style.display = 'none';
    }
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
    if(!act) return;
    if(navigator.vibrate) navigator.vibrate(50);
    
    let multiplier = (state.userAge < 18) ? 0.8 : 1.2;
    let xpGained = act.xp * amount;
    if(act.unit === 'ც') xpGained *= multiplier;

    let gearMultiplier = 1;
    state.ownedGear.forEach(gearId => {
        const item = shopItems.gear.find(g => g.id === gearId);
        if (item) {
            if (item.type === 'global') gearMultiplier += item.val;
            if (item.type === act.id) gearMultiplier += item.val;
            if (item.type === 'strength' && ['gym_upper', 'pushups', 'pullups', 'squats'].includes(act.id)) gearMultiplier += item.val;
        }
    });

    if(act.muscles) {
        for(let mKey in act.muscles) {
            if(state.muscles[mKey]) state.muscles[mKey].energy -= (act.muscles[mKey] * amount);
        }
    }

    xpGained = xpGained * gearMultiplier;
    if (state.activeEffects.xpMultiplier > 1) {
        xpGained *= state.activeEffects.xpMultiplier;
        UI.showToast(`⚡ ბუსტი აქტიურია! (x${state.activeEffects.xpMultiplier})`, 'success');
        state.activeEffects.xpMultiplier = 1; 
    }
    
    xpGained = Math.round(xpGained); 
    state.xp += xpGained; 
    state.coins += xpGained;
    
    state.lastWorkoutTime = Date.now(); 

    updateQuestProgress(act.id, amount);
    checkBetProgress(xpGained);
    damageBoss(xpGained * 0.5);
    updateHistory(xpGained);
    addToLog(act.name, amount, xpGained);
    
    for (let key in state.muscles) if (state.muscles[key].energy < 0) state.muscles[key].energy = 0;
    
    checkLevelUp(); saveData(); UI.renderBody(); calculateGoal(); UI.updateUI(); 
    UI.closeModal('inputModal'); UI.SoundFX.success();
    if(gearMultiplier > 1) UI.showToast(`Gear ბონუსი: +${Math.round((gearMultiplier-1)*100)}%`, 'success');
}

export function calculatePassiveRecovery() {
    const now = Date.now();
    const lastWorkout = state.lastWorkoutTime || 0;
    let lastCalc = parseInt(localStorage.getItem('lastCalcTime'));
    if (!lastCalc) { lastCalc = now; localStorage.setItem('lastCalcTime', now); }

    const cooldownMs = 1 * 60 * 60 * 1000; 
    const recoveryStartTime = lastWorkout + cooldownMs;

    if (now < recoveryStartTime) {
        localStorage.setItem('lastCalcTime', now);
        return;
    }

    const effectiveStartTime = Math.max(lastCalc, recoveryStartTime);
    const hoursPassed = (now - effectiveStartTime) / (1000 * 60 * 60);

    if (hoursPassed > 0) {
        const recoveryRate = 1.2;
        let changed = false;
        for (let key in state.muscles) {
            if (state.muscles[key].energy < 100) {
                state.muscles[key].energy += (hoursPassed * recoveryRate);
                if (state.muscles[key].energy > 100) state.muscles[key].energy = 100;
                changed = true;
            }
        }
        if (changed) saveData();
    }
    localStorage.setItem('lastCalcTime', now);
}

export function openBetModal() {
    if(state.activeBet) { UI.showToast("უკვე გაქვს აქტიური ფსონი!", "error"); return; }
    document.getElementById('betModal').style.display = 'flex';
}

export function placeBet() {
    const amount = parseInt(document.getElementById('betAmountInput').value);
    if(!amount || amount <= 0) { UI.showToast("შეიყვანე სწორი თანხა", "error"); return; }
    if(state.coins < amount) { UI.showToast("არ გაქვს საკმარისი ოქრო", "error"); return; }
    state.coins -= amount;
    state.activeBet = { amount: amount, targetXp: 200, currentXp: 0, startTime: Date.now(), endTime: Date.now() + (24 * 60 * 60 * 1000) };
    UI.closeModal('betModal'); UI.showToast(`🎲 ფსონი დადებულია! -${amount} ოქრო`); UI.SoundFX.click(); saveData(); UI.updateUI();
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
    let unit = 'ც'; 
    if(allSports.find(s=>s.name===name)?.unit === 'სთ') unit = 'სთ'; 
    const newLog = { date: 'დღეს', time: timeStr, name: name, desc: `${amount} ${unit}`, xp: xpVal }; 
    state.activityLog.unshift(newLog); 
    if(state.activityLog.length > 5) state.activityLog.pop(); 
    UI.renderLog(); 
}

function updateHistory(amount) { 
    let todayIndex = state.xpHistory.length - 1; 
    state.xpHistory[todayIndex].val += amount; 
    UI.renderChart(); 
}

function calculateGoal() { 
    let totalEnergy = 0; for (let k in state.muscles) totalEnergy += state.muscles[k].energy; 
    let avgEnergy = totalEnergy / 4; 
    let progress = 0; if (avgEnergy <= 60) { progress = 100; } else { progress = ((100 - avgEnergy) / 40) * 100; } 
    if (progress < 0) progress = 0; progress = Math.round(progress); 
    const xpEl = document.getElementById('dailyXp'); if(xpEl) xpEl.innerText = progress; 
    const ring = document.getElementById('dailyRing'); if(ring) ring.style.background = `conic-gradient(var(--yellow) ${progress * 3.6}deg, #333 0deg)`; 
}

function checkLevelUp() { 
    let calculatedLevel = Math.floor(state.xp / 1000) + 1; 
    if (calculatedLevel > state.level) { 
        state.level = calculatedLevel; UI.SoundFX.levelUp(); UI.triggerConfetti(); 
        UI.showToast(`🎉 Level Up: ${state.level}!`, "success"); 
        if(navigator.vibrate) navigator.vibrate([200, 100, 200]); 
        checkAchievements();
        UI.updateProfileUI(); 
    } 
}

function updateQuestProgress(type, amount) {
    if (state.dailyQuest.completed) return;
    if (state.dailyQuest.type !== type) return;
    state.dailyQuest.progress += amount;
    if (state.dailyQuest.progress >= state.dailyQuest.target) {
        state.dailyQuest.progress = state.dailyQuest.target; state.dailyQuest.completed = true; 
        state.coins += state.dailyQuest.reward; UI.SoundFX.success(); UI.triggerConfetti(); 
        UI.showToast(`🎉 მისია შესრულებულია! +${state.dailyQuest.reward} ოქრო!`, 'success'); UI.updateUI(); 
    }
    UI.updateQuestUI();
}

function damageBoss(dmg) {
    if(!state.currentBoss) return;
    state.currentBoss.hp -= dmg;
    if(state.currentBoss.hp <= 0) {
        state.currentBoss.hp = 0; state.coins += state.currentBoss.reward;
        const defeatDate = new Date().toLocaleDateString();
        state.bossTrophies.push({ name: state.currentBoss.name, icon: state.currentBoss.icon, date: defeatDate, reward: state.currentBoss.reward });
        localStorage.setItem('bossTrophies', JSON.stringify(state.bossTrophies));
        UI.showToast(`⚔️ ბოსი დამარცხდა! +${state.currentBoss.reward} ოქრო`, 'success');
        UI.SoundFX.levelUp(); UI.triggerConfetti(); rollLoot(); checkAchievements(); setTimeout(initBoss, 2000); 
    } else { UI.SoundFX.attack(); }
    UI.updateBossUI();
}

export function checkAchievements() {
    let newUnlock = false;
    achievements.forEach(ach => {
        if(!state.unlockedAchievements.includes(ach.id) && ach.condition(state)) {
            state.unlockedAchievements.push(ach.id);
            state.coins += ach.reward;
            UI.showToast(`🏆 მიღწევა გახსნილია: ${ach.name} (+${ach.reward} 🪙)`, "success");
            UI.SoundFX.success();
            newUnlock = true;
        }
    });
    if(newUnlock) { saveData(); UI.updateUI(); }
}

function rollLoot() {
    if (Math.random() > 0.6) {
        let droppedItem = null;
        for(let item of shopItems.rareLoot) { if(Math.random() < item.chance) { droppedItem = item; break; } }
        if (droppedItem) {
            state.inventory[droppedItem.id] = (state.inventory[droppedItem.id] || 0) + 1; saveData();
            setTimeout(() => { UI.showToast(`🎁 იშვიათი ნადავლი: ${droppedItem.name}!`, "success"); alert(`🎉 გილოცავ! ბოსმა ამოაგდო: ${droppedItem.name}\n${droppedItem.desc}`); }, 500);
        }
    }
}

export function checkQuestReset() {
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000;
    if (now - state.lastQuestTime > twelveHours) {
        state.dailyQuest = generateNewQuest(); state.lastQuestTime = now; 
        const today = new Date().toDateString();
        if(localStorage.getItem('lastDate') !== today) {
             const days = ['კვი', 'ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ']; 
             let dayName = days[new Date().getDay()]; state.xpHistory.shift(); state.xpHistory.push({ day: dayName, val: 0 });
             localStorage.setItem('lastDate', today);
        }
        saveData(); UI.showToast("📜 ახალი მისია მიღებულია!", "success");
    }
}

function generateNewQuest() {
    let availableSports = allSports.filter(s => state.userSports.includes(s.id));
    if(availableSports.length === 0) availableSports = allSports;
    const randomSport = availableSports[Math.floor(Math.random() * availableSports.length)];
    let target = (randomSport.unit === 'სთ') ? 1 : 50;
    let text = (randomSport.unit === 'სთ') ? `${randomSport.name}: 1 საათი` : `${randomSport.name}: 50 ${randomSport.unit}`;
    return { type: randomSport.id, target: target, text: text, reward: 150, progress: 0, completed: false };
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
        if(state.userSports.length > 1) { state.userSports = state.userSports.filter(s => s !== id); } 
        else { UI.showToast("მინიმუმ 1 სპორტი აუცილებელია!", "error"); return; }
    } else { state.userSports.push(id); }
    UI.renderSportsSelector(); UI.SoundFX.click(); saveData();
}

export function buyItem(id, price, name) { 
    if(state.coins >= price) { 
        if(!confirm(`გინდა იყიდო ${name}?`)) return; 
        state.coins -= price; state.inventory[id] = (state.inventory[id] || 0) + 1; saveData(); 
        UI.openShop(); UI.updateUI(); UI.SoundFX.success(); UI.showToast("ნივთი ნაყიდია!", "success"); 
    } else { UI.SoundFX.error(); UI.showToast("არ გაქვს საკმარისი ოქრო!", "error"); } 
}

export function buyTheme(id, price) { 
    if(state.currentTheme === id) return; 
    if(price === 0 || state.coins >= price) { 
        if(price > 0 && !confirm(`გინდა იყიდო თემა?`)) return; 
        if(price > 0) state.coins -= price; state.currentTheme = id; applyTheme(id); saveData(); 
        UI.openShop(); UI.updateUI(); UI.SoundFX.success(); 
    } else { UI.SoundFX.error(); UI.showToast("არაა საკმარისი ოქრო", "error"); } 
}

export function buyGear(id, price, name) {
    if (state.ownedGear.includes(id)) { UI.showToast("უკვე ნაყიდი გაქვს!", "error"); return; }
    if (state.coins >= price) {
        if(!confirm(`გინდა იყიდო ${name}?`)) return;
        state.coins -= price; state.ownedGear.push(id); saveData(); 
        UI.SoundFX.success(); UI.showToast("აღჭურვილობა ნაყიდია!", "success"); UI.openShop(); UI.updateUI();
    } else { UI.SoundFX.error(); UI.showToast("არ გაქვს საკმარისი ოქრო!", "error"); }
}

export function useItem(id) { 
    if (!state.inventory[id] || state.inventory[id] <= 0) return; 
    const lootItem = shopItems.rareLoot.find(i => i.id === id);
    if (id === 'protein_shake') { 
        state.activeEffects.xpMultiplier = 1.5; UI.showToast("💪 პროტეინი მიღებულია! +50% XP შემდეგზე!"); 
    } else if (id === 'energy_drink') { 
        UI.showToast("⚡ ენერგეტიკული: დაღლილობა მოიხსნა (Cooldown განულდა)!"); state.lastWorkoutTime = 0; 
    } else if (lootItem) {
        if (lootItem.type === 'sell') { state.coins += lootItem.val; UI.showToast(`💰 გაყიდულია! +${lootItem.val} ოქრო`); } 
        else if (lootItem.type === 'xp_boost') { state.xp += lootItem.val; checkLevelUp(); UI.showToast(`📚 +${lootItem.val} XP მიღებულია!`); }
    }
    state.inventory[id]--; saveData(); UI.SoundFX.drink(); UI.openInventory(); UI.updateUI();
}

export function applyTheme(id) { 
    const root = document.documentElement; 
    if(id === 'default') { root.style.setProperty('--green', '#00ff9d'); root.style.setProperty('--yellow', '#ffcc00'); } 
    else if (id === 'gold') { root.style.setProperty('--green', '#ffd700'); root.style.setProperty('--yellow', '#fff8e1'); } 
    else if (id === 'cyber') { root.style.setProperty('--green', '#00e5ff'); root.style.setProperty('--yellow', '#ff00ff'); } 
    else if (id === 'red') { root.style.setProperty('--green', '#ff0055'); root.style.setProperty('--yellow', '#ff4444'); } 
}

export function checkBossAttack() {
    if (!state.currentBoss || state.currentBoss.hp <= 0) return;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - state.lastBossAttack > oneDay) {
        const damage = 100 * state.level;
        if (state.coins >= damage) { state.coins -= damage; UI.showToast(`👹 ბოსმა შეგიტია! -${damage} ოქრო!`, "error"); } 
        else { state.coins = 0; for(let key in state.muscles) state.muscles[key].energy = 0; UI.renderBody(); UI.showToast(`👹 ბოსმა შეგიტია! ენერგია განულდა!`, "error"); }
        document.body.classList.add('damage-shake'); setTimeout(() => document.body.classList.remove('damage-shake'), 500);
        UI.SoundFX.error(); state.lastBossAttack = now; saveData(); UI.updateUI();
    }
}

export function openSettingsMenu() { document.getElementById('settingsMenuModal').style.display = 'flex'; }
export function openSportsEdit() { UI.renderSportsSelector(); document.getElementById('sportsModal').style.display = 'flex'; }
export function openAchievements() { document.getElementById('achievementsModal').style.display = 'flex'; }
export function resetAllData() { if(confirm("წავშალოთ?")) { localStorage.clear(); location.reload(); } }

export function openProfileEdit() { 
    document.getElementById('modalNameInput').value = state.userName; document.getElementById('modalAgeInput').value = state.userAge;
    document.getElementById('editProfileModal').style.display = 'flex'; 
}

export function openAvatarSelection() {
    const grid = document.getElementById('avatarGrid'); grid.innerHTML = '';
    avatars.forEach(av => {
        const isSelected = state.userAvatar === av;
        grid.innerHTML += `<div class="avatar-option ${isSelected ? 'selected' : ''}" onclick="window.selectAvatar('${av}')">${av}</div>`;
    });
    document.getElementById('avatarModal').style.display = 'flex';
}

export function selectAvatar(av) {
    state.userAvatar = av;
    saveData();
    UI.updateProfileUI();
    UI.closeModal('avatarModal');
    UI.showToast("ავატარი განახლდა!", "success");
    UI.SoundFX.click();
}

export function saveProfileChanges() {
    const nameVal = document.getElementById('modalNameInput').value.trim();
    const ageVal = parseInt(document.getElementById('modalAgeInput').value);
    if(!nameVal) { UI.showToast("სახელი აუცილებელია!", "error"); return; }
    state.userName = nameVal; 
    if(ageVal && ageVal > 0) { state.userAge = ageVal; }
    saveData(); UI.updateProfileUI(); UI.closeModal('editProfileModal'); UI.showToast("პროფილი წარმატებით განახლდა!", "success");
}

import { state, shopItems, allSports, achievements, avatars } from './data.js';
import { buyItem, buyTheme, buyGear, useItem, toggleSport, setupInput, openBetModal, placeBet, openAvatarSelection, selectAvatar } from './logic.js';

window.openBetModal = openBetModal;
window.placeBet = placeBet;
window.openAvatarSelection = openAvatarSelection;
window.selectAvatar = selectAvatar;

export const SoundFX = {
    ctx: new (window.AudioContext || window.webkitAudioContext)(),
    playTone: function(freq, type, duration) {
        if(this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + duration);
    },
    click: function() { this.playTone(600, 'sine', 0.1); },
    success: function() { this.playTone(400, 'triangle', 0.1); setTimeout(()=>this.playTone(600, 'triangle', 0.1), 100); setTimeout(()=>this.playTone(800, 'triangle', 0.2), 200); },
    error: function() { this.playTone(150, 'sawtooth', 0.3); },
    drink: function() { this.playTone(300, 'sine', 0.4); },
    attack: function() { this.playTone(100, 'sawtooth', 0.1); },
    levelUp: function() { [400, 500, 600, 800, 1000].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.2), i*100)); }
};

export function showToast(msg, type = 'success') {
    let bg = type === 'success' ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff5f6d, #ffc371)";
    if(type === 'error') bg = "linear-gradient(to right, #ff3b3b, #ff0000)";
    Toastify({ text: msg, duration: 3000, gravity: "top", position: "center", style: { background: bg, borderRadius: "10px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }, onClick: function(){} }).showToast();
}

export function triggerConfetti() { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00ff9d', '#ffcc00', '#9d00ff'] }); }
export function closeModal(id) { document.getElementById(id).style.display = 'none'; }

export function showPage(id, btn) { 
    SoundFX.click(); 
    document.querySelectorAll('.section').forEach(e => e.classList.remove('active')); 
    document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active')); 
    document.getElementById(id).classList.add('active'); 
    btn.classList.add('active'); 
    
    if(id === 'workoutPage') renderWorkoutPage();
}

export function updateProfileUI() {
    if(document.getElementById('mainProfileName')) document.getElementById('mainProfileName').innerText = state.userName;
    if(document.getElementById('mainProfileAvatar')) document.getElementById('mainProfileAvatar').innerText = state.userAvatar;
    let rank = "დამწყები";
    if(state.level >= 50) rank = "ღმერთი ⚡"; else if(state.level >= 30) rank = "ტიტანი 🗿"; else if(state.level >= 20) rank = "სპარტანელი ⚔️"; else if(state.level >= 10) rank = "ათლეტი 🏃";
    
    if(document.getElementById('mainProfileRank')) document.getElementById('mainProfileRank').innerText = rank;
    if(document.getElementById('levelDisplay')) document.getElementById('levelDisplay').innerText = `LVL ${state.level}`;
}

export function updateUI() { 
    if(document.getElementById('totalPoints')) document.getElementById('totalPoints').innerText = state.xp; 
    if(document.getElementById('coinDisplay')) document.getElementById('coinDisplay').innerText = state.coins; 
    
    // Active Bet Banner Logic (Updated for Home Screen)
    const betBanner = document.getElementById('activeBetBanner');
    if(state.activeBet) {
        betBanner.style.display = 'flex';
        document.getElementById('betTargetDisplay').innerText = `${state.activeBet.currentXp}/${state.activeBet.targetXp}`;
        const timeLeft = Math.max(0, state.activeBet.endTime - Date.now());
        const hrs = Math.floor(timeLeft / (1000 * 60 * 60));
        const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('betTimerDisplay').innerText = `${hrs}სთ ${mins}წთ`;
    } else { betBanner.style.display = 'none'; }

    updateProfileUI(); updateBatteryUI(); renderGraveyard(); 
}

export function updateBatteryUI() {
    let totalEnergy = 0; let count = 0; for(let k in state.muscles) { totalEnergy += state.muscles[k].energy; count++; }
}

export function renderBody() {
    for (const key in state.muscles) { 
        const m = state.muscles[key]; 
        const el = document.getElementById(m.visualId); const dot = document.getElementById(`dot-${key}`); const text = document.getElementById(`text-${key}`);
        let color = 'var(--green)';
        if(el) {
            el.classList.remove('atrophied');
            if (m.energy < 30) { el.classList.add('atrophied'); color = '#552222'; } 
            else if (m.energy < 60) { color = 'var(--red)'; el.style.fill = color; } 
            else if (m.energy < 90) { color = 'var(--yellow)'; el.style.fill = color; } 
            else { color = 'var(--green)'; el.style.fill = color; }
        }
        if(dot) { dot.style.background = color; dot.style.boxShadow = `0 0 5px ${color}`; }
        if(text) { text.innerText = Math.round(m.energy) + '%'; text.style.color = (m.energy < 30) ? 'var(--red)' : '#888'; }
    }

    const statusEl = document.getElementById('recoveryStatusDisplay');
    if(statusEl) {
        const now = Date.now();
        const lastWorkout = state.lastWorkoutTime || 0;
        const cooldownMs = 1 * 60 * 60 * 1000; 
        const unlockTime = lastWorkout + cooldownMs;
        
        if (now < unlockTime) {
            const timeLeft = unlockTime - now;
            const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((timeLeft % (1000 * 60)) / 1000);
            statusEl.innerHTML = `⛔ კუნთები შოკშია. აღდგენამდე: <span style="color:var(--red)">${m}წთ ${s}წმ</span>`;
            statusEl.style.color = '#888';
        } else {
            let full = true;
            for(let k in state.muscles) if(state.muscles[k].energy < 99.9) full = false;
            if(full) { statusEl.innerHTML = `✅ სხეული სრულად აღდგენილია!`; statusEl.style.color = 'var(--green)'; } 
            else { statusEl.innerHTML = `⚡ <span style="color:var(--green)">აღდგენა აქტიურია...</span> (1.2% / სთ)`; statusEl.style.color = '#ccc'; }
        }
    }
}

export function updateBossUI() {
    const card = document.getElementById('bossCard'); if(!state.currentBoss) { card.style.display = 'none'; return; }
    card.style.display = 'flex';
    document.getElementById('bossIconContainer').innerHTML = state.currentBoss.icon; 
    document.getElementById('bossName').innerText = state.currentBoss.name;
    const pct = (state.currentBoss.hp / state.currentBoss.maxHp) * 100;
    document.getElementById('bossHpBar').style.width = pct + '%';
    document.getElementById('bossHpText').innerText = `${Math.round(state.currentBoss.hp)} / ${state.currentBoss.maxHp} HP`;
}

export function updateQuestUI() {
    const text = document.getElementById('questText'); const bar = document.getElementById('questBar'); 
    if(!text || !state.dailyQuest) return;
    if (state.dailyQuest.completed) { 
        text.innerHTML = `<s>${state.dailyQuest.text}</s> <span style="color:var(--green)">✅</span>`; 
        bar.style.width = '100%'; bar.style.backgroundColor = 'var(--green)'; 
    } else { 
        text.innerText = state.dailyQuest.text; 
        const pct = Math.min(100, (state.dailyQuest.progress / state.dailyQuest.target) * 100); 
        bar.style.width = pct + '%'; bar.style.backgroundColor = 'var(--purple)'; 
    }
}

export function renderGraveyard() {
    const grid = document.getElementById('graveyardGrid'); if(!grid) return; grid.innerHTML = '';
    if(state.bossTrophies.length === 0) { grid.innerHTML = '<p style="color:#666; width:100%; text-align:center;">ჯერ არცერთი ბოსი არ დაგიმარცხებია.</p>'; return; }
    state.bossTrophies.slice().reverse().forEach(boss => {
        grid.innerHTML += `<div class="shop-item owned" style="border-color: #552222; opacity:1;"><div class="shop-icon" style="background: rgba(255, 59, 59, 0.2); border:1px solid var(--red);">${boss.icon}</div><div class="shop-info"><strong>${boss.name}</strong><br><small>📅 ${boss.date} | 💰 +${boss.reward}</small></div></div>`;
    });
}

let xpChartInstance = null;
export function renderChart() {
    const ctx = document.getElementById('xpChart'); if(!ctx) return;
    const labels = state.xpHistory.map(item => item.day); const data = state.xpHistory.map(item => item.val);
    const color = getComputedStyle(document.documentElement).getPropertyValue('--green').trim() || '#00ff9d';
    if (xpChartInstance) { xpChartInstance.data.labels = labels; xpChartInstance.data.datasets[0].data = data; xpChartInstance.data.datasets[0].backgroundColor = data.map(v => v > 500 ? '#ffd700' : color); xpChartInstance.update(); } 
    else { xpChartInstance = new Chart(ctx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'XP', data: data, backgroundColor: color, borderRadius: 4, borderWidth: 0, barThickness: 'flex', maxBarThickness: 20 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#2a2a30' }, ticks: { color: '#888', font: { size: 10 } } }, x: { grid: { display: false }, ticks: { color: '#fff', font: { size: 10 } } } } } }); }
}

export function renderLog() { 
    const container = document.getElementById('activityLogContainer'); if(!container) return; 
    if(state.activityLog.length === 0) { container.innerHTML = '<p style="text-align:center; color:#555; font-size:0.8rem;">ისტორია ცარიელია</p>'; return; } 
    container.innerHTML = ''; state.activityLog.forEach(item => { container.innerHTML += `<div class="log-item"><div style="flex:1"><span class="log-name">${item.name}</span><span class="log-desc">${item.desc} | ${item.date}, ${item.time}</span></div><div class="log-xp">+${item.xp} XP</div></div>`; }); 
}

export function renderSportsSelector() {
    const grid = document.getElementById('sportsSelectorGrid'); if(!grid) return; grid.innerHTML = '';
    allSports.forEach(sport => { const isSelected = state.userSports.includes(sport.id); grid.innerHTML += `<div class="sport-toggle-item ${isSelected ? 'selected' : ''}" onclick="toggleSport('${sport.id}')"><span class="sp-icon">${sport.icon}</span><span class="sp-name">${sport.name}</span></div>`; });
}

export function openShop() {
    const consGrid = document.getElementById('shopConsumablesGrid'); const themeGrid = document.getElementById('shopThemesGrid'); const gearGrid = document.getElementById('shopGearGrid');
    consGrid.innerHTML = ''; themeGrid.innerHTML = ''; if(gearGrid) gearGrid.innerHTML = '';
    
    // FIX: Update the coin display inside the shop modal immediately
    document.getElementById('shopCoinDisplay').innerText = state.coins;

    shopItems.consumables.forEach(item => { consGrid.innerHTML += `<div class="shop-item" onclick="window.buyItem('${item.id}', ${item.price}, '${item.name}')"><div class="shop-icon"><svg class="icon-svg" viewBox="0 0 24 24"><path d="M10 2v2l-3 3v13h13V7l-3-3V2H10zM7 11h10"/></svg></div><div class="shop-info"><strong>${item.name}</strong><br><small>${item.desc}</small></div><div style="font-weight:bold; color:var(--yellow);">${item.price} 🪙</div></div>`; });
    
    // UPDATED THEME LOGIC IN SHOP
    shopItems.themes.forEach(item => { 
        const isActive = (state.currentTheme === item.id); 
        const isOwned = state.ownedThemes.includes(item.id);
        
        let buttonText = isOwned ? (isActive ? '✅' : '<span style="color:var(--green)">არჩევა</span>') : `<small>${item.price > 0 ? item.price + ' 🪙' : 'უფასო'}</small>`;

        themeGrid.innerHTML += `
            <div class="shop-item ${isOwned ? 'owned' : ''}" style="border-left: 3px solid ${item.color}" onclick="buyTheme('${item.id}', ${item.price})">
                <div class="shop-icon" style="background:${item.color}"></div>
                <div class="shop-info">
                    <strong>${item.name}</strong>
                    ${isOwned ? '<br><small style="color:#aaa;">ნაყიდია</small>' : ''}
                </div>
                <div>${buttonText}</div>
            </div>`; 
    });

    if(gearGrid) { shopItems.gear.forEach(item => { const isOwned = state.ownedGear.includes(item.id); gearGrid.innerHTML += `<div class="shop-item ${isOwned ? 'owned' : ''}" onclick="buyGear('${item.id}', ${item.price}, '${item.name}')"><div class="shop-icon">${item.icon}</div><div class="shop-info"><strong>${item.name}</strong>${item.type === 'global' ? '<span class="gear-badge">გლობალური</span>' : ''}<br><small>${item.desc}</small></div><div style="font-weight:bold; color:var(--yellow);">${isOwned ? 'ნაყიდია' : item.price + ' 🪙'}</div></div>`; }); }
    document.getElementById('shopModal').style.display = 'flex';
}

export function openInventory() {
    const grid = document.getElementById('inventoryGrid'); const effectDisplay = document.getElementById('activeEffectsDisplay'); grid.innerHTML = '';
    if(state.activeEffects.xpMultiplier > 1) { effectDisplay.innerHTML = `⚡ <strong>+50% XP</strong> აქტიურია შემდეგ ვარჯიშზე!`; } else { effectDisplay.innerHTML = ''; }
    let hasItems = false; 
    const allItemsMap = {};
    shopItems.consumables.forEach(i => allItemsMap[i.id] = {...i, typeClass: 'normal', icon: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M10 2v2l-3 3v13h13V7l-3-3V2H10zM7 11h10"/></svg>`});
    shopItems.rareLoot.forEach(i => allItemsMap[i.id] = {...i, typeClass: 'rare'});
    for (let [id, qty] of Object.entries(state.inventory)) { 
        if (qty > 0) { hasItems = true; const meta = allItemsMap[id] || { name: id, icon: '?', desc: '?', typeClass: 'normal' }; const isRare = meta.typeClass === 'rare';
            grid.innerHTML += `<div class="shop-item" style="${isRare ? 'border:1px solid var(--purple); background:rgba(157,0,255,0.1);' : ''}"><div class="shop-icon">${meta.icon}</div><div class="shop-info"><strong>${meta.name}</strong><br><small>${meta.desc}</small></div><button class="btn-small" onclick="useItem('${id}')">გამოყენება (${qty})</button></div>`; 
        } 
    }
    if(!hasItems) grid.innerHTML = '<p style="color:#666;">ჩანთა ცარიელია</p>'; 
    document.getElementById('inventoryModal').style.display = 'flex';
}

export function renderWorkoutPage() {
    const grid = document.getElementById('workoutPageGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const mySports = allSports.filter(s => state.userSports.includes(s.id));
    
    mySports.forEach(act => {
        grid.innerHTML += `
            <div class="activity-card" onclick="setupInput('${act.id}')">
                <div class="shop-icon" style="font-size:1.5rem;">${act.icon}</div>
                <div class="shop-info" style="flex:1;"><strong>${act.name}</strong></div>
            </div>`;
    });
    grid.innerHTML += `<div class="activity-card" onclick="window.openSportsEdit()" style="border-style:dashed; opacity:0.7;"><div class="shop-icon">+</div><div class="shop-info"><strong>დამატება</strong></div></div>`;
}

export function openAchievements() {
    const grid = document.getElementById('achievementsGrid'); grid.innerHTML = '';
    achievements.forEach(ach => {
        const isUnlocked = state.unlockedAchievements.includes(ach.id);
        grid.innerHTML += `
            <div class="shop-item ${isUnlocked ? 'owned' : ''}" style="opacity: ${isUnlocked ? 1 : 0.6}; border-color: ${isUnlocked ? 'var(--yellow)' : '#333'};">
                <div class="shop-icon" style="font-size: 1.5rem; background: ${isUnlocked ? 'rgba(255,204,0,0.2)' : '#333'};">${ach.icon}</div>
                <div class="shop-info"><strong>${ach.name} ${isUnlocked ? '✅' : ''}</strong><br><small>${ach.desc}</small></div>
                <div style="font-weight:bold; color:var(--yellow);">${isUnlocked ? 'მიღებულია' : `+${ach.reward} 🪙`}</div>
            </div>
        `;
    });
    document.getElementById('achievementsModal').style.display = 'flex';
}
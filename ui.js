import { state, shopItems, allSports, achievements } from './data.js';
import { buyItem, buyTheme, buyGear, useItem, toggleSport, setupInput, completeRoutineTask, resetRoutine } from './logic.js';

window.completeRoutineTask = completeRoutineTask;
window.resetRoutine = resetRoutine;

export const SoundFX = {
    ctx: new (window.AudioContext || window.webkitAudioContext)(),
    playTone: function(freq, type, duration) {
        if(this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + duration);
    },
    click: function() { this.playTone(600, 'sine', 0.05); },
    success: function() { this.playTone(400, 'triangle', 0.1); setTimeout(()=>this.playTone(600, 'triangle', 0.1), 100); },
    error: function() { this.playTone(150, 'sawtooth', 0.3); },
    attack: function() { this.playTone(100, 'sawtooth', 0.1); },
    levelUp: function() { [400, 500, 600, 800].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.1), i*100)); }
};

export function showToast(msg, type = 'success') {
    let bg = type === 'success' ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff5f6d, #ffc371)";
    if(type === 'error') bg = "linear-gradient(to right, #ff3b3b, #ff0000)";
    Toastify({ text: msg, duration: 3000, gravity: "top", position: "center", style: { background: bg, borderRadius: "10px" } }).showToast();
}

export function triggerConfetti() { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00d2ff', '#ff0099'] }); }
export function closeModal(id) { document.getElementById(id).style.display = 'none'; }

export function showPage(id, btn) { 
    SoundFX.click();
    document.querySelectorAll('.section').forEach(e => e.classList.remove('active')); 
    document.querySelectorAll('.nav-btn').forEach(e => e.classList.remove('active')); 
    document.getElementById(id).classList.add('active'); 
    btn.classList.add('active'); 
    
    if(id === 'workoutPage') renderWorkoutPage();
    if(id === 'routine') renderRoutinePage();
}

export function renderRoutinePage() {
    const setupBox = document.getElementById('routineSetup');
    const timelineBox = document.getElementById('routineTimeline');
    const list = document.getElementById('timelineItems');
    
    const today = new Date().toDateString();
    const hasActiveRoutine = state.routine.active && state.routine.lastGenerated === today;

    if (hasActiveRoutine) {
        setupBox.style.display = 'none';
        timelineBox.style.display = 'block';
        list.innerHTML = '';

        state.routine.tasks.forEach((task, index) => {
            const btnHtml = task.completed ? '' : `<button class="t-action" onclick="window.completeRoutineTask(${index})">დასრულება (+${task.xp} XP)</button>`;
            const styleClass = task.completed ? 'completed' : '';
            
            list.innerHTML += `
                <div class="t-item ${styleClass}">
                    <span class="t-time">${task.time}</span>
                    <span class="t-title">${task.title}</span>
                    ${task.xp ? `<span class="t-xp">${task.xp} XP</span>` : ''}
                    ${btnHtml}
                </div>`;
        });
    } else {
        setupBox.style.display = 'block';
        timelineBox.style.display = 'none';
    }
}

export function updateProfileUI() {
    document.getElementById('mainProfileName').innerText = state.userName;
    document.getElementById('mainProfileAvatar').innerText = state.userAvatar;
    document.getElementById('levelDisplay').innerText = `LVL ${state.level}`;
}

export function updateUI() { 
    document.getElementById('totalPoints').innerText = state.xp; 
    document.getElementById('coinDisplay').innerText = state.coins; 
    if(document.getElementById('shopCoinDisplay')) document.getElementById('shopCoinDisplay').innerText = state.coins;
    document.getElementById('streakDisplay').innerText = state.stats.streak;
    document.getElementById('boostDisplay').innerText = state.activeEffects.xpMultiplier > 1 ? '50%' : '0%';

    let goal = 1000;
    let pct = Math.min(100, (state.xp % 1000) / 10);
    document.getElementById('dailyXpBar').style.width = pct + '%';
    document.getElementById('dailyXp').innerText = Math.round(pct);

    if(state.activeBet) {
        document.getElementById('activeBetBanner').style.display = 'block';
        document.getElementById('betTargetDisplay').innerText = `${state.activeBet.currentXp}/${state.activeBet.targetXp}`;
    } else { document.getElementById('activeBetBanner').style.display = 'none'; }

    updateProfileUI(); renderBody(); updateBossUI();
}

export function renderBody() {
    for (const key in state.muscles) { 
        const m = state.muscles[key]; 
        const el = document.getElementById(`visual-${key}`);
        const bar = document.getElementById(`bar-${key}`);
        
        let color = '#00ff9d';
        if (m.energy < 40) color = '#ff4b4b';
        else if (m.energy < 70) color = '#ffd700';
        
        if(el) {
            el.style.fill = (m.energy < 30) ? 'url(#rustPattern)' : '#333';
            el.style.stroke = color;
        }
        if(bar) {
            bar.style.width = m.energy + '%';
            bar.style.background = color;
        }
    }
    
    const statusEl = document.getElementById('recoveryStatusDisplay');
    let needsRecovery = Object.values(state.muscles).some(m => m.energy < 50);
    statusEl.innerText = needsRecovery ? "⚠️ კუნთები დაღლილია. დაისვენე." : "✅ სხეული მზადაა ვარჯიშისთვის.";
    statusEl.style.color = needsRecovery ? "var(--danger)" : "var(--success)";
}

export function updateBossUI() {
    const card = document.getElementById('bossCard'); 
    if(!state.currentBoss) { card.style.display = 'none'; return; }
    card.style.display = 'flex';
    document.getElementById('bossIconContainer').innerText = state.currentBoss.icon; 
    document.getElementById('bossName').innerText = state.currentBoss.name;
    const pct = (state.currentBoss.hp / state.currentBoss.maxHp) * 100;
    document.getElementById('bossHpBar').style.width = pct + '%';
    document.getElementById('bossHpText').innerText = `${Math.round(state.currentBoss.hp)} HP`;
}

export function renderWorkoutPage() {
    const grid = document.getElementById('workoutPageGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const mySports = allSports.filter(s => state.userSports.includes(s.id));
    
    mySports.forEach(act => {
        grid.innerHTML += `
            <div class="activity-card" onclick="setupInput('${act.id}')">
                <div class="card-icon">${act.icon}</div>
                <div class="card-content">
                    <strong>${act.name}</strong>
                    <small style="color:#aaa">+${act.xp} XP</small>
                </div>
                <div style="color:var(--primary)">GO ▶</div>
            </div>`;
    });
}

export function openShop() {
    const coinEl = document.getElementById('shopCoinDisplay');
    if(coinEl) coinEl.innerText = state.coins;
    
    const themeGrid = document.getElementById('shopThemesGrid'); themeGrid.innerHTML = '';
    shopItems.themes.forEach(t => {
        const owned = state.ownedThemes.includes(t.id);
        themeGrid.innerHTML += `<div class="shop-item" onclick="window.buyTheme('${t.id}', ${t.price})"><div class="card-icon" style="background:${t.color}"></div><div class="card-content"><strong>${t.name}</strong><small>${owned ? 'ნაყიდია' : t.price}</small></div></div>`;
    });

    const gearGrid = document.getElementById('shopGearGrid'); gearGrid.innerHTML = '';
    shopItems.gear.forEach(g => {
        const owned = state.ownedGear.includes(g.id);
        gearGrid.innerHTML += `<div class="shop-item" onclick="window.buyGear('${g.id}', ${g.price})"><div class="card-icon">${g.icon}</div><div class="card-content"><strong>${g.name}</strong><small>${g.desc}</small></div><div>${owned ? '✅' : g.price}</div></div>`;
    });

    const consGrid = document.getElementById('shopConsumablesGrid'); consGrid.innerHTML = '';
    shopItems.consumables.forEach(c => {
        consGrid.innerHTML += `<div class="shop-item" onclick="window.buyItem('${c.id}', ${c.price}, '${c.name}')"><div class="card-icon">${c.icon}</div><div class="card-content"><strong>${c.name}</strong><small>${c.desc}</small></div><div>${c.price}</div></div>`;
    });

    document.getElementById('shopModal').style.display = 'flex';
}

export function renderSportsSelector() {
    const grid = document.getElementById('sportsSelectorGrid'); grid.innerHTML = '';
    allSports.forEach(s => {
        const active = state.userSports.includes(s.id);
        grid.innerHTML += `<div class="shop-item ${active ? 'active' : ''}" style="border-color:${active?'var(--success)':'#333'}" onclick="window.toggleSport('${s.id}')"><div style="width:20px;">${s.icon}</div> ${s.name}</div>`;
    });
}

export function renderLog() { 
    const c = document.getElementById('activityLogContainer'); c.innerHTML = '';
    if(state.activityLog.length === 0) c.innerHTML = '<small>ისტორია ცარიელია</small>';
    state.activityLog.forEach(i => c.innerHTML += `<div style="border-bottom:1px solid #333; padding:10px; display:flex; justify-content:space-between;"><span>${i.name} (${i.desc})</span><span style="color:var(--success)">+${i.xp}</span></div>`);
}

let xpChartInstance = null;
export function renderChart() {
    const ctx = document.getElementById('xpChart'); if(!ctx) return;
    const labels = state.xpHistory.map(i => i.day); const vals = state.xpHistory.map(i => i.val);
    if(xpChartInstance) { xpChartInstance.data.datasets[0].data = vals; xpChartInstance.update(); }
    else {
        xpChartInstance = new Chart(ctx, {
            type: 'line',
            data: { labels: labels, datasets: [{ label: 'XP', data: vals, borderColor: '#00d2ff', backgroundColor: 'rgba(0, 210, 255, 0.1)', fill: true, tension: 0.4 }] },
            options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
        });
    }
}

window.buyTheme = buyTheme; window.buyGear = buyGear; window.buyItem = buyItem; window.toggleSport = toggleSport;

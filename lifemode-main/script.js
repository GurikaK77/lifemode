import { state } from './data.js';
import * as UI from './ui.js';
import * as Logic from './logic.js';

// Window Bindings
window.showPage = UI.showPage;
window.confirmWorkout = Logic.confirmWorkout;
window.setupInput = Logic.setupInput;
window.buyItem = Logic.buyItem;
window.buyTheme = Logic.buyTheme;
window.buyGear = Logic.buyGear;
window.useItem = Logic.useItem;
window.toggleSport = Logic.toggleSport;
window.openShop = UI.openShop;
window.openInventory = UI.openInventory;
window.closeModal = UI.closeModal;
window.openSettingsMenu = Logic.openSettingsMenu;
window.openProfileEdit = Logic.openProfileEdit;
window.openSportsEdit = Logic.openSportsEdit;
window.saveProfileChanges = Logic.saveProfileChanges;
window.openAchievements = Logic.openAchievements;
window.resetAllData = Logic.resetAllData;
window.openBetModal = Logic.openBetModal;
window.placeBet = Logic.placeBet;
window.openAvatarSelection = Logic.openAvatarSelection;
window.selectAvatar = Logic.selectAvatar;

// Dev Mode Bindings
window.checkSecretCode = Logic.checkSecretCode;
window.closeDevMenu = Logic.closeDevMenu;
window.devAddCoins = Logic.devAddCoins;
window.devAddXp = Logic.devAddXp;
window.devSetMuscle = Logic.devSetMuscle;
window.devUnlockAll = Logic.devUnlockAll;

// AI Bindings
window.startAiSession = Logic.startAiSession;
window.stopAiSession = Logic.stopAiSession;

function init() {
    try {
        // Streak Logic
        const today = new Date().toDateString();
        if (state.stats.lastLoginDate !== today) {
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            if (state.stats.lastLoginDate === yesterday.toDateString()) {
                state.stats.streak++;
                UI.showToast(`🔥 Streak: ${state.stats.streak} დღე!`, "success");
            } else {
                state.stats.streak = 1;
            }
            state.stats.lastLoginDate = today;
            Logic.saveData();
        }
        
        UI.updateProfileUI();
        Logic.applyTheme(state.currentTheme);
        Logic.initBoss();
        Logic.calculatePassiveRecovery();
        Logic.checkQuestReset();
        Logic.checkBossAttack();
        Logic.checkAchievements();

        UI.renderBody();
        UI.renderChart();
        UI.renderLog();
        UI.updateQuestUI();
        UI.updateUI(); 
        UI.renderWorkoutPage(); 

        document.querySelectorAll('button, .setting-item, .shop-item, .nav-item, .action-card, .avatar-option').forEach(el => {
            el.addEventListener('click', () => UI.SoundFX.click());
        });

        setInterval(() => { UI.renderBody(); }, 1000);
        setInterval(() => { Logic.calculatePassiveRecovery(); }, 60000);

    } catch (e) { console.error("Init Error:", e); }
}

document.addEventListener('DOMContentLoaded', init);
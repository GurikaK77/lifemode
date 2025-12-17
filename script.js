import { state } from './data.js';
import * as UI from './ui.js';
import * as Logic from './logic.js';

window.showPage = UI.showPage;
window.setupInput = Logic.setupInput;
window.confirmWorkout = Logic.confirmWorkout;
window.openShop = UI.openShop;
window.openInventory = () => { UI.closeModal('shopModal'); document.getElementById('inventoryModal').style.display = 'flex'; };
window.closeModal = UI.closeModal;
window.generateAiRoutine = Logic.generateAiRoutine;
window.openSettingsMenu = Logic.openSettingsMenu;
window.openProfileEdit = Logic.openProfileEdit;
window.saveProfileChanges = Logic.saveProfileChanges;
window.openSportsEdit = Logic.openSportsEdit;
window.resetAllData = Logic.resetAllData;
window.openAchievements = () => document.getElementById('achievementsModal').style.display='flex';
window.openBetModal = Logic.openBetModal;
window.placeBet = Logic.placeBet;
window.openAvatarSelection = Logic.openAvatarSelection;
window.selectAvatar = Logic.selectAvatar;

window.checkSecretCode = Logic.checkSecretCode;
window.devAddCoins = Logic.devAddCoins;
window.devAddXp = Logic.devAddXp;
window.devSetMuscle = Logic.devSetMuscle;
window.devUnlockAll = Logic.devUnlockAll;

function init() {
    try {
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
            
            if(state.routine.lastGenerated !== today) {
                state.routine.active = false; 
            }
            
            Logic.saveData();
        }
        
        Logic.initBoss();
        Logic.calculatePassiveRecovery();
        Logic.checkAchievements();

        UI.renderBody();
        UI.renderChart();
        UI.renderLog();
        UI.renderRoutinePage();
        UI.updateUI(); 

        setInterval(() => { Logic.saveData(); }, 30000);

    } catch (e) { console.error("Init Error:", e); }
}

document.addEventListener('DOMContentLoaded', init);

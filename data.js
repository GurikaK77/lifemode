const svgs = {
    run: `<svg viewBox="0 0 24 24" class="card-icon-svg" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 18a1 1 0 0 1-2 0c0-1.5.5-2 1.5-3l1-1-1.5-3.5-3 1.5v-3l4-2 2 3 .5 3 2 1.5-.5 3.5zm7-2l-3-5 1-4-2-1 2-5-3-1v3l-2 1-1 3 3 2 1 4 2 3z"/></svg>`,
    gym: `<svg viewBox="0 0 24 24" class="card-icon-svg" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 5L4 7.5 16.5 20 19 17.5 6.5 5zm11 0l-2.5 2.5L20 12.5 22.5 10 17.5 5zM1.5 14L4 16.5 9 11.5 6.5 9 1.5 14z"/></svg>`,
    bike: `<svg viewBox="0 0 24 24" class="card-icon-svg" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6l-3 3-3-2-2 3-3 1m14-1l-3 3"/></svg>`,
    swim: `<svg viewBox="0 0 24 24" class="card-icon-svg" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><circle cx="17" cy="8" r="2"/></svg>`,
    yoga: `<svg viewBox="0 0 24 24" class="card-icon-svg" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="4" r="2"/><path d="M10 14l-4 4m8-4l4 4m-4-10l-4 4 4 4 4-4-4-4z"/></svg>`,
    ball: `<svg viewBox="0 0 24 24" class="card-icon-svg" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 12l4-4m-4 4l-4-4m4 4v6"/></svg>`,
    potion: `<svg viewBox="0 0 24 24" class="card-icon-svg" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v2l-3 3v13h13V7l-3-3V2H10zM7 11h10"/></svg>`,
    watch: `<svg viewBox="0 0 24 24" class="card-icon-svg" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="20" rx="2"/><rect x="8" y="6" width="8" height="12"/></svg>`
};

const safeParse = (key, defaultVal) => { try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : defaultVal; } catch (e) { return defaultVal; } };

export const avatars = ["👤", "🦸‍♂️", "🥷", "🤖", "💀", "👽", "👾", "🧙‍♂️", "🧟", "🧛"];

export const achievements = [
    { id: 'lvl5', name: 'ახალბედა', desc: 'მიაღწიე მე-5 დონეს', icon: '🥉', condition: (state) => state.level >= 5, reward: 100 },
    { id: 'lvl10', name: 'ათლეტი', desc: 'მიაღწიე მე-10 დონეს', icon: '🥈', condition: (state) => state.level >= 10, reward: 250 },
    { id: 'lvl20', name: 'სპარტანელი', desc: 'მიაღწიე მე-20 დონეს', icon: '🥇', condition: (state) => state.level >= 20, reward: 500 },
    { id: 'boss_killer', name: 'მონადირე', desc: 'დაამარცხე 1 ბოსი მაინც', icon: '☠️', condition: (state) => state.bossTrophies.length >= 1, reward: 300 },
    { id: 'routine_master', name: 'დისციპლინა', desc: 'შეასრულე რუტინის 5 დავალება', icon: '📅', condition: (state) => state.stats.routineTasksDone >= 5, reward: 200 }
];

export const allSports = [
    { id: 'run', name: 'სირბილი', icon: svgs.run, unit: 'სთ', xp: 80, muscles: { legs: 10, abs: 2 } },
    { id: 'pushups', name: 'აზიდვები', icon: svgs.gym, unit: 'ც', xp: 2, muscles: { chest: 0.2, arms: 0.15, abs: 0.05 }, aiSupported: true },
    { id: 'pullups', name: 'ტურნიკზე აწევა', icon: svgs.gym, unit: 'ც', xp: 5, muscles: { arms: 0.4, chest: 0.1, abs: 0.1 } }, 
    { id: 'squats', name: 'ჩაჯდომები', icon: svgs.gym, unit: 'ც', xp: 3, muscles: { legs: 0.25, abs: 0.05 }, aiSupported: true }, 
    { id: 'crunches', name: 'პრესი', icon: svgs.yoga, unit: 'ც', xp: 1.5, muscles: { abs: 0.4, chest: 0.05 }, aiSupported: false }, 
    { id: 'football', name: 'ფეხბურთი', icon: svgs.ball, unit: 'სთ', xp: 100, muscles: { legs: 12, abs: 4, chest: 2 } },
    { id: 'swim', name: 'ცურვა', icon: svgs.swim, unit: 'სთ', xp: 90, muscles: { arms: 6, chest: 5, legs: 5, abs: 3 } },
    { id: 'cycling', name: 'ველოსიპედი', icon: svgs.bike, unit: 'სთ', xp: 70, muscles: { legs: 14, abs: 2 } },
    { id: 'gym_upper', name: 'ტრენაჟორები', icon: svgs.gym, unit: 'სთ', xp: 110, muscles: { chest: 10, arms: 10, abs: 5 } },
    { id: 'yoga', name: 'იოგა', icon: svgs.yoga, unit: 'სთ', xp: 50, muscles: { abs: 5, legs: 2, arms: 2, chest: 1 } },
    { id: 'boxing', name: 'კრივი', icon: svgs.gym, unit: 'სთ', xp: 120, muscles: { arms: 10, chest: 5, abs: 8, legs: 5 } }
];

export const shopItems = {
    consumables: [
        { id: 'protein_shake', name: 'პროტეინი', price: 300, desc: '+50% XP შემდეგ ვარჯიშზე', icon: svgs.potion },
        { id: 'energy_drink', name: 'ენერგეტიკული', price: 150, desc: 'ხსნის დაღლილობას', icon: svgs.potion }
    ],
    themes: [
        { id: 'default', name: 'Neon Blue', color: '#00d2ff', price: 0 },
        { id: 'gold', name: 'Gold Luxury', color: '#ffd700', price: 1000 },
        { id: 'red', name: 'Red Alert', color: '#ff0055', price: 2000 }
    ],
    gear: [
        { id: 'smart_watch', name: 'სმარტ საათი', price: 2000, desc: '+10% XP ყველაფერზე', type: 'global', val: 0.1, icon: svgs.watch },
        { id: 'running_shoes', name: 'სუპერ კეტები', price: 1500, desc: '+20% XP სირბილზე', type: 'run', val: 0.2, icon: svgs.run }
    ]
};

export const bossDefinitions = [
    { name: "სიზარმაცის დემონი", icon: "👹", baseHp: 1000, reward: 500 },
    { name: "შაქრის გიგანტი", icon: "🍩", baseHp: 1500, reward: 800 },
    { name: "უძილობის აჩრდილი", icon: "👻", baseHp: 2500, reward: 1200 }
];

export const state = {
    xp: parseInt(localStorage.getItem('xp')) || 0,
    coins: parseInt(localStorage.getItem('coins')) || 0,
    level: parseInt(localStorage.getItem('level')) || 1,
    userName: localStorage.getItem('userName') || "Guest",
    userAvatar: localStorage.getItem('userAvatar') || "👤",
    currentTheme: localStorage.getItem('theme') || 'default',
    ownedThemes: safeParse('ownedThemes', ['default']),
    userSports: safeParse('userSports', ['run', 'pushups', 'pullups', 'squats']), 
    activityLog: safeParse('activityLog', []),
    xpHistory: safeParse('xpHistory', initHistory()),
    muscles: safeParse('muscles', {
        legs: { energy: 100 }, chest: { energy: 100 }, arms: { energy: 100 }, abs: { energy: 100 }
    }),
    inventory: safeParse('inventory', {}),
    activeEffects: safeParse('activeEffects', { xpMultiplier: 1 }),
    currentBoss: safeParse('currentBoss', null),
    bossTrophies: safeParse('bossTrophies', []),
    ownedGear: JSON.parse(localStorage.getItem('ownedGear')) || [],
    unlockedAchievements: JSON.parse(localStorage.getItem('unlockedAchievements')) || [],
    stats: JSON.parse(localStorage.getItem('stats')) || { betsWon: 0, streak: 0, lastLoginDate: null, routineTasksDone: 0 },
    activeBet: safeParse('activeBet', null),
    lastWorkoutTime: parseInt(localStorage.getItem('lastWorkoutTime')) || 0,
    routine: safeParse('routine', {
        active: false,
        lastGenerated: null,
        busyStart: "09:00",
        busyEnd: "15:00",
        workoutStart: "17:00",
        workoutEnd: "19:00",
        isRestDay: false,
        tasks: [] 
    }),
    selectedActivity: null
};

function initHistory() {
    const days = ['კვი', 'ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ'];
    let arr = []; let d = new Date();
    for(let i=6; i>=0; i--) { let tempD = new Date(); tempD.setDate(d.getDate() - i); arr.push({ day: days[tempD.getDay()], val: 0 }); }
    return arr;
}

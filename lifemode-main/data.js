const Icons = {
    run_real: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M13 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 18a1 1 0 0 1-2 0c0-1.5.5-2 1.5-3l1-1-1.5-3.5-3 1.5v-3l4-2 2 3 .5 3 2 1.5-.5 3.5zm7-2l-3-5 1-4-2-1 2-5-3-1v3l-2 1-1 3 3 2 1 4 2 3z"/></svg>`,
    pushups: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 17.5l-2.5-7.5-6.5 2.5-3.5-3.5-5 5v3h17.5z"/><circle cx="5" cy="14" r="1.5"/></svg>`, 
    pullups: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M3 3h18M5 3v5c0 1.1.9 2 2 2h2l1 6h4l1-6h2c1.1 0 2-.9 2-2V3M12 10v10m-3 0h6"/></svg>`, 
    squats: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-2 18v-5l-2-2 1-4h6l1 4-2 2v5h-4z"/></svg>`,
    ball: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 12l4-4m-4 4l-4-4m4 4v6"/></svg>`,
    swim: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><circle cx="17" cy="8" r="2"/><path d="M15 10l-3 3 3 3"/></svg>`,
    bike: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6l-3 3-3-2-2 3-3 1m14-1l-3 3"/></svg>`,
    gym: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M6 4h12M4 8h16M4 20h16M6 16h12M9 4v16m6-16v16"/></svg>`,
    yoga: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><path d="M10 14l-4 4m8-4l4 4m-4-10l-4 4 4 4 4-4-4-4z"/></svg>`,
    glove: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M8 7h8v2H8zm0 4h8v2H8zm0 4h5v2H8z"/></svg>`,
    potion: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M10 2v2l-3 3v13h13V7l-3-3V2H10zM7 11h10"/></svg>`,
    watch: `<svg class="icon-svg" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2"/><rect x="8" y="6" width="8" height="12" fill="none" stroke="currentColor"/></svg>`,
    shoe: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M4 16v3h3l10-10-3-3-10 10zm13-11l3 3-12 12H5v-3l12-12z"/></svg>`,
    dumbell: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M6.5 5L4 7.5 16.5 20 19 17.5 6.5 5zm11 0l-2.5 2.5L20 12.5 22.5 10 17.5 5zM1.5 14L4 16.5 9 11.5 6.5 9 1.5 14z"/></svg>`,
    mat: `<svg class="icon-svg" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="16" x2="22" y2="16"/></svg>`,
    trophy: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M8 21h8m-4-13v13M17 7l1-3H6l1 3m2-3v3a5 5 0 0 0 10 0V4"/></svg>`,
    scroll: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M7 7h10M7 11h10M7 15h7"/></svg>`,
    diamond: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/></svg>`,
    demon: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2 5-2 5-2-5 2-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    donut: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>`,
    couch: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M20 9V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v6h20v-6c0-1.1-.9-2-2-2z"/></svg>`,
    ghost: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M9 21h6v-2h-6v2zm3-19C7.58 2 4 5.58 4 10v7h2v-7c0-3.31 2.69-6 6-6s6 2.69 6 6v7h2v-7c0-4.42-3.58-8-8-8z"/></svg>`
};

const safeParse = (key, defaultVal) => { try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : defaultVal; } catch (e) { return defaultVal; } };

export const avatars = ["👤", "👦", "👧", "👨", "👩", "👴", "🦸‍♂️", "🥷", "🤖", "💀", "🐶", "🐱"];

export const achievements = [
    { id: 'lvl5', name: 'ახალბედა', desc: 'მიაღწიე მე-5 დონეს', icon: '🥉', condition: (state) => state.level >= 5, reward: 100 },
    { id: 'lvl10', name: 'ათლეტი', desc: 'მიაღწიე მე-10 დონეს', icon: '🥈', condition: (state) => state.level >= 10, reward: 250 },
    { id: 'lvl20', name: 'სპარტანელი', desc: 'მიაღწიე მე-20 დონეს', icon: '🥇', condition: (state) => state.level >= 20, reward: 500 },
    { id: 'rich', name: 'ფულიანი', desc: 'დააგროვე 5000 ოქრო', icon: '💰', condition: (state) => state.coins >= 5000, reward: 200 },
    { id: 'boss_killer', name: 'მონადირე', desc: 'დაამარცხე 1 ბოსი მაინც', icon: '☠️', condition: (state) => state.bossTrophies.length >= 1, reward: 300 },
    { id: 'bet_winner', name: 'აზარტული', desc: 'მოიგე 1 ფსონი მაინც', icon: '🎲', condition: (state) => state.stats.betsWon >= 1, reward: 150 },
    { id: 'dedicated', name: 'ერთგული', desc: 'ივარჯიშე ზედიზედ 3 დღე', icon: '🔥', condition: (state) => state.stats.streak >= 3, reward: 400 }
];

export const allSports = [
    { id: 'run', name: 'სირბილი', icon: Icons.run_real, unit: 'სთ', xp: 80, muscles: { legs: 10, abs: 2 } },
    { id: 'pushups', name: 'აზიდვები', icon: Icons.pushups, unit: 'ც', xp: 2, muscles: { chest: 0.2, arms: 0.15, abs: 0.05 }, aiSupported: true },
    { id: 'pullups', name: 'ტურნიკზე აწევა', icon: Icons.pullups, unit: 'ც', xp: 5, muscles: { arms: 0.4, chest: 0.1, abs: 0.1 } }, 
    { id: 'squats', name: 'ჩაჯდომები', icon: Icons.squats, unit: 'ც', xp: 3, muscles: { legs: 0.25, abs: 0.05 }, aiSupported: true }, 
    { id: 'crunches', name: 'პრესი', icon: Icons.yoga, unit: 'ც', xp: 1.5, muscles: { abs: 0.4, chest: 0.05 }, aiSupported: false }, 
    { id: 'football', name: 'ფეხბურთი', icon: Icons.ball, unit: 'სთ', xp: 100, muscles: { legs: 12, abs: 4, chest: 2 } },
    { id: 'swim', name: 'ცურვა', icon: Icons.swim, unit: 'სთ', xp: 90, muscles: { arms: 6, chest: 5, legs: 5, abs: 3 } },
    { id: 'basketball', name: 'კალათბურთი', icon: Icons.ball, unit: 'სთ', xp: 95, muscles: { legs: 8, arms: 4, abs: 3 } },
    { id: 'cycling', name: 'ველოსიპედი', icon: Icons.bike, unit: 'სთ', xp: 70, muscles: { legs: 14, abs: 2 } },
    { id: 'gym_upper', name: 'ტრენაჟორები (ზედა)', icon: Icons.gym, unit: 'სთ', xp: 110, muscles: { chest: 10, arms: 10, abs: 5 } },
    { id: 'yoga', name: 'იოგა', icon: Icons.yoga, unit: 'სთ', xp: 50, muscles: { abs: 5, legs: 2, arms: 2, chest: 1 } },
    { id: 'tennis', name: 'ჩოგბურთი', icon: Icons.ball, unit: 'სთ', xp: 90, muscles: { arms: 7, legs: 8, abs: 4 } },
    { id: 'boxing', name: 'კრივი', icon: Icons.glove, unit: 'სთ', xp: 120, muscles: { arms: 10, chest: 5, abs: 8, legs: 5 } }
];

export const shopItems = {
    consumables: [
        { id: 'protein_shake', name: 'პროტეინი', price: 300, desc: '+50% XP შემდეგ ვარჯიშზე', icon: Icons.potion },
        { id: 'energy_drink', name: 'ენერგეტიკული', price: 150, desc: 'ხსნის დაღლილობას (Cooldown Reset)', icon: Icons.energy }
    ],
    themes: [
        { id: 'default', name: 'სტანდარტული', color: '#00ff9d', price: 0 },
        { id: 'gold', name: 'მილიონერი', color: '#ffd700', price: 1000 },
        { id: 'cyber', name: 'კიბერპანკი', color: '#00e5ff', price: 2500 },
        { id: 'red', name: 'სისხლიანი მთვარე', color: '#ff0055', price: 5000 }
    ],
    gear: [
        { id: 'smart_watch', name: 'სმარტ საათი', price: 2000, desc: '+10% XP ყველაფერზე', type: 'global', val: 0.1, icon: Icons.watch },
        { id: 'running_shoes', name: 'სუპერ კეტები', price: 1500, desc: '+20% XP სირბილზე', type: 'run', val: 0.2, icon: Icons.shoe },
        { id: 'dumbbells', name: 'მძიმე ჰანტელები', price: 1800, desc: '+15% XP ძალისმიერზე', type: 'strength', val: 0.15, icon: Icons.dumbell },
        { id: 'yoga_mat', name: 'იოგას ხალიჩა', price: 1200, desc: '+25% XP იოგაზე', type: 'yoga', val: 0.25, icon: Icons.mat }
    ],
    rareLoot: [
        { id: 'boss_trophy_gold', name: 'ოქროს თასი', type: 'sell', val: 2000, desc: 'გაყიდე 2000 ოქროდ', chance: 0.4, icon: Icons.trophy },
        { id: 'ancient_scroll', name: 'სიბრძნის გრაგნილი', type: 'xp_boost', val: 500, desc: 'მომენტალური +500 XP', chance: 0.3, icon: Icons.scroll },
        { id: 'diamond', name: 'იშვიათი ალმასი', type: 'sell', val: 5000, desc: 'გაყიდე 5000 ოქროდ', chance: 0.1, icon: Icons.diamond }
    ]
};

export const bossDefinitions = [
    { name: "სიზარმაცის დემონი", icon: Icons.demon, baseHp: 1000, reward: 500 },
    { name: "შაქრის გიგანტი", icon: Icons.donut, baseHp: 1500, reward: 800 },
    { name: "დივნის მეფე", icon: Icons.couch, baseHp: 2000, reward: 1000 },
    { name: "უძილობის აჩრდილი", icon: Icons.ghost, baseHp: 2500, reward: 1200 }
];

export const state = {
    xp: parseInt(localStorage.getItem('xp')) || 0,
    coins: parseInt(localStorage.getItem('coins')) || 0,
    level: parseInt(localStorage.getItem('level')) || 1,
    userAge: parseInt(localStorage.getItem('userAge')) || 15,
    userName: localStorage.getItem('userName') || "LifeMode",
    userAvatar: localStorage.getItem('userAvatar') || "👤",
    currentTheme: localStorage.getItem('theme') || 'default',
    ownedThemes: safeParse('ownedThemes', ['default']), // დამატებულია ნაყიდი თემები
    lastWorkoutTime: parseInt(localStorage.getItem('lastWorkoutTime')) || 0,
    activeBet: safeParse('activeBet', null),
    userSports: safeParse('userSports', ['run', 'pushups', 'pullups', 'squats', 'crunches']), 
    activityLog: safeParse('activityLog', []),
    xpHistory: safeParse('xpHistory', initHistory()),
    muscles: safeParse('muscles', {
        legs: { name: 'ფეხები', energy: 100, visualId: 'visual-legs' },
        chest: { name: 'მკერდი', energy: 100, visualId: 'visual-chest' },
        arms: { name: 'ხელები', energy: 100, visualId: 'visual-arms' },
        abs: { name: 'პრესი', energy: 100, visualId: 'visual-abs' }
    }),
    inventory: safeParse('inventory', {}),
    activeEffects: safeParse('activeEffects', { xpMultiplier: 1, expiry: 0 }),
    currentBoss: safeParse('currentBoss', null),
    bossTrophies: safeParse('bossTrophies', []),
    dailyQuest: safeParse('dailyQuest', null),
    lastQuestTime: parseInt(localStorage.getItem('lastQuestTime')) || 0, 
    lastBossAttack: parseInt(localStorage.getItem('lastBossAttack')) || Date.now(),
    ownedGear: JSON.parse(localStorage.getItem('ownedGear')) || [],
    selectedActivity: null,
    unlockedAchievements: JSON.parse(localStorage.getItem('unlockedAchievements')) || [], 
    stats: JSON.parse(localStorage.getItem('stats')) || { betsWon: 0, streak: 0, lastLoginDate: null } 
};

function initHistory() {
    const days = ['კვი', 'ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ'];
    let arr = []; let d = new Date();
    for(let i=6; i>=0; i--) { let tempD = new Date(); tempD.setDate(d.getDate() - i); arr.push({ day: days[tempD.getDay()], val: 0 }); }
    return arr;
}
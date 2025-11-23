// script.js

const characterDisplay = document.getElementById('main-character');
const spinButtonSingle = document.getElementById('spin-button-single');
const textDisplay = document.getElementById('current-text');

const backgroundMusic = document.getElementById('background-music');
const spinSound = document.getElementById('spin-sound'); 
const heartExplosionContainer = document.getElementById('heart-explosion-container'); 

const modeSelectorButtons = document.querySelectorAll('.mode-selector button');
const contentSections = document.querySelectorAll('.content-section');

const slotItems3 = document.querySelectorAll('#three-slot .slot-item img');
const spinButtonThree = document.getElementById('spin-button-three');
const slotItems5 = document.querySelectorAll('#five-slot .slot-item img');
const spinButtonFive = document.getElementById('spin-button-five');

const DURATION_SINGLE = 3000;
const DURATION_SLOT = 4000;
const TOTAL_CHARACTERS = CHARACTER_LIST.length;
const HEART_COUNT = 30; 

let interval;
let currentIndex = 0; 
let spinningSlots = []; 

function startBackgroundMusic() {
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch(error => {
        console.log("Background music autoplay failed:", error);
    });
}

function initializeContent() {
    if (TOTAL_CHARACTERS === 0) {
        console.error("CHARACTER_LIST is empty! Please fill characters.js.");
        return;
    }
    
    characterDisplay.src = CHARACTER_LIST[0];
    textDisplay.textContent = "Its time to choose!";

    const defaultImage = CHARACTER_LIST[0];
    slotItems3.forEach(img => img.src = defaultImage);
    slotItems5.forEach(img => img.src = defaultImage);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeContent();
    document.addEventListener('click', startBackgroundMusic, { once: true });
});

modeSelectorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        
        modeSelectorButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        contentSections.forEach(section => {
            if (section.id.includes(mode)) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    });
});

function startSpinSingle() {
    spinButtonSingle.disabled = true;
    textDisplay.textContent = "CHOOSING...";
    
    spinSound.currentTime = 0;
    spinSound.volume = 0.7;
    spinSound.play().catch(e => console.log("Spin sound failed to play:", e));

    interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % TOTAL_CHARACTERS;
        characterDisplay.src = CHARACTER_LIST[currentIndex];
        characterDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => { characterDisplay.style.transform = 'scale(1)'; }, 50);
    }, 100); 

    setTimeout(stopSpinSingle, DURATION_SINGLE);
}

function stopSpinSingle() {
    clearInterval(interval);
    spinSound.pause();

    const winningIndex = Math.floor(Math.random() * TOTAL_CHARACTERS);
    
    characterDisplay.style.transition = `transform ${DURATION_SINGLE / 1000}s ease-out`;
    
    setTimeout(() => {
        const winnerFile = CHARACTER_LIST[winningIndex];
        characterDisplay.src = winnerFile; 
        
        const winnerName = winnerFile.replace('.png', '').replace(/[_.-]/g, ' ').toUpperCase();
        textDisplay.textContent = winnerName;
        
        textDisplay.style.transform = 'scale(1.2)';
        
        createHeartExplosion();

        setTimeout(() => {
            textDisplay.style.transform = 'scale(1)';
            spinButtonSingle.disabled = false;
        }, 500); 
    }, DURATION_SINGLE / 2); 
}

if (spinButtonSingle) {
    spinButtonSingle.addEventListener('click', startSpinSingle);
}

function startSpinSlots(slotElements, spinButton) {
    spinButton.disabled = true;
    
    spinSound.currentTime = 0;
    spinSound.volume = 0.7;
    spinSound.play().catch(e => console.log("Spin sound failed to play:", e));

    spinningSlots = [];
    slotElements.forEach((slot, index) => {
        const duration = DURATION_SLOT + (index * 500);
        
        let interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * TOTAL_CHARACTERS);
            slot.src = CHARACTER_LIST[randomIndex];
        }, 50);

        spinningSlots.push({ interval, slot, duration });
    });

    spinningSlots.forEach((slotData, index) => {
        setTimeout(() => {
            clearInterval(slotData.interval);
            
            slotData.slot.style.transition = 'transform 0.5s ease-out';
            slotData.slot.style.transform = 'scale(1.1)'; 
            
            setTimeout(() => {
                slotData.slot.style.transform = 'scale(1)';
                
                if (index === slotElements.length - 1) {
                    spinButton.disabled = false;
                }
            }, 500);
        }, slotData.duration);
    });
}

if (spinButtonThree) {
    spinButtonThree.addEventListener('click', () => {
        startSpinSlots(slotItems3, spinButtonThree);
    });
}

if (spinButtonFive) {
    spinButtonFive.addEventListener('click', () => {
        startSpinSlots(slotItems5, spinButtonFive);
    });
}

function createHeartExplosion() {
    if (!document.getElementById('single-selector').classList.contains('active')) return;
    
    heartExplosionContainer.innerHTML = ''; 
    const SPREAD_DISTANCE = 800; 

    for (let i = 0; i < HEART_COUNT; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        const spreadX = (Math.random() - 0.5) * SPREAD_DISTANCE; 
        const spreadY = (Math.random() - 0.5) * SPREAD_DISTANCE; 
        
        heart.style.setProperty('--x', `${spreadX}px`);
        heart.style.setProperty('--y', `${spreadY}px`);
        heartExplosionContainer.appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }
}
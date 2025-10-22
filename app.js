// Plant Growth Tracker App
class PlantTracker {
    constructor() {
        this.growthStages = [
            { name: 'Seed', minDays: 0, emoji: '🌰', class: 'seed' },
            { name: 'Sprout', minDays: 3, emoji: '🌱', class: 'sprout' },
            { name: 'Seedling', minDays: 7, emoji: '🌿', class: 'seedling' },
            { name: 'Growing', minDays: 14, emoji: '🪴', class: 'growing' },
            { name: 'Budding', minDays: 21, emoji: '🌲', class: 'budding' },
            { name: 'Flowering', minDays: 28, emoji: '🌳', class: 'flowering' },
            { name: 'Mature', minDays: 35, emoji: '🎄', class: 'mature' }
        ];

        this.loadData();
        this.initializeUI();
        this.checkNewDay();
    }

    loadData() {
        const saved = localStorage.getItem('plantTrackerData');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentDay = data.currentDay || 0;
            this.lastCheckIn = data.lastCheckIn || null;
            this.waterCount = data.waterCount || 0;
            this.careCount = data.careCount || 0;
            this.streak = data.streak || 0;
            this.history = data.history || [];
            this.todayCheckedIn = data.todayCheckedIn || false;
            this.todayWatered = data.todayWatered || false;
            this.todayCared = data.todayCared || false;
        } else {
            this.resetData();
        }
    }

    resetData() {
        this.currentDay = 0;
        this.lastCheckIn = null;
        this.waterCount = 0;
        this.careCount = 0;
        this.streak = 0;
        this.history = [];
        this.todayCheckedIn = false;
        this.todayWatered = false;
        this.todayCared = false;
    }

    saveData() {
        const data = {
            currentDay: this.currentDay,
            lastCheckIn: this.lastCheckIn,
            waterCount: this.waterCount,
            careCount: this.careCount,
            streak: this.streak,
            history: this.history,
            todayCheckedIn: this.todayCheckedIn,
            todayWatered: this.todayWatered,
            todayCared: this.todayCared
        };
        localStorage.setItem('plantTrackerData', JSON.stringify(data));
    }

    initializeUI() {
        // Get DOM elements
        this.plantElement = document.getElementById('plant');
        this.currentDayElement = document.getElementById('currentDay');
        this.growthStageElement = document.getElementById('growthStage');
        this.healthStatusElement = document.getElementById('healthStatus');
        this.streakElement = document.getElementById('streakCount');
        this.messageElement = document.getElementById('messageBox');
        this.lastCheckInElement = document.getElementById('lastCheckIn');
        this.progressFillElement = document.getElementById('progressFill');
        this.progressTextElement = document.getElementById('progressText');
        this.historyLogElement = document.getElementById('historyLog');

        // Bind buttons
        document.getElementById('waterBtn').addEventListener('click', () => this.waterPlant());
        document.getElementById('careBtn').addEventListener('click', () => this.giveCare());
        document.getElementById('checkInBtn').addEventListener('click', () => this.dailyCheckIn());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetProgress());

        this.updateUI();
    }

    checkNewDay() {
        if (!this.lastCheckIn) return;

        const lastDate = new Date(this.lastCheckIn);
        const today = new Date();

        // Reset daily actions if it's a new day
        if (!this.isSameDay(lastDate, today)) {
            this.todayCheckedIn = false;
            this.todayWatered = false;
            this.todayCared = false;

            // Check if streak is broken (missed more than 1 day)
            const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            if (daysDiff > 1) {
                this.streak = 0;
                this.addHistory('💔 Streak broken! Your plant missed you.');
            }

            this.saveData();
            this.updateUI();
        }
    }

    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    getCurrentStage() {
        for (let i = this.growthStages.length - 1; i >= 0; i--) {
            if (this.currentDay >= this.growthStages[i].minDays) {
                return this.growthStages[i];
            }
        }
        return this.growthStages[0];
    }

    getNextStage() {
        const currentStage = this.getCurrentStage();
        const currentIndex = this.growthStages.indexOf(currentStage);
        if (currentIndex < this.growthStages.length - 1) {
            return this.growthStages[currentIndex + 1];
        }
        return null;
    }

    getProgress() {
        const currentStage = this.getCurrentStage();
        const nextStage = this.getNextStage();

        if (!nextStage) return 100; // Fully grown

        const daysInStage = this.currentDay - currentStage.minDays;
        const daysNeeded = nextStage.minDays - currentStage.minDays;
        const progress = (daysInStage / daysNeeded) * 100;

        return Math.min(progress, 100);
    }

    waterPlant() {
        if (this.todayWatered) {
            this.showMessage('💧 Already watered today! Come back tomorrow.');
            return;
        }

        this.todayWatered = true;
        this.waterCount++;
        this.addHistory(`💧 Watered the plant (Day ${this.currentDay})`);
        this.showMessage('💧 Your plant drinks happily! It looks refreshed!');
        this.celebrate();
        this.saveData();
        this.updateUI();
    }

    giveCare() {
        if (this.todayCared) {
            this.showMessage('✨ Already gave love today! Come back tomorrow.');
            return;
        }

        this.todayCared = true;
        this.careCount++;
        this.addHistory(`✨ Gave love to the plant (Day ${this.currentDay})`);
        this.showMessage('✨ Your plant feels the love! It glows with happiness!');
        this.celebrate();
        this.saveData();
        this.updateUI();
    }

    dailyCheckIn() {
        const today = new Date();

        if (this.lastCheckIn) {
            const lastDate = new Date(this.lastCheckIn);
            if (this.isSameDay(lastDate, today)) {
                this.showMessage('✅ Already checked in today! Come back tomorrow.');
                return;
            }
        }

        // Check in
        this.currentDay++;
        this.lastCheckIn = today.toISOString();
        this.todayCheckedIn = true;

        // Update streak
        if (this.lastCheckIn) {
            const lastDate = new Date(this.lastCheckIn);
            const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1 || this.streak === 0) {
                this.streak++;
            }
        } else {
            this.streak = 1;
        }

        // Check for stage advancement
        const previousStage = this.getCurrentStage();
        const newStage = this.getCurrentStage();

        if (previousStage.name !== newStage.name) {
            this.addHistory(`🎉 Advanced to ${newStage.name} stage! ${newStage.emoji}`);
            this.showMessage(`🎉 Congratulations! Your plant is now a ${newStage.name}! ${newStage.emoji}`);
        } else {
            this.addHistory(`✅ Daily check-in (Day ${this.currentDay})`);
            this.showMessage(`✅ Day ${this.currentDay} complete! Keep nurturing your plant!`);
        }

        this.celebrate();
        this.saveData();
        this.updateUI();

        // Check if fully grown
        if (this.currentDay >= this.growthStages[this.growthStages.length - 1].minDays) {
            setTimeout(() => {
                this.showMessage('🎉🎊 CONGRATULATIONS! Your plant is fully mature! You did it! 🎊🎉');
            }, 1000);
        }
    }

    updateUI() {
        // Update stats
        this.currentDayElement.textContent = this.currentDay;
        const currentStage = this.getCurrentStage();
        this.growthStageElement.textContent = currentStage.name;
        this.streakElement.textContent = this.streak;

        // Update health status
        const health = this.getHealthStatus();
        this.healthStatusElement.textContent = health;

        // Update plant visual
        const plantStage = this.plantElement.querySelector('.plant-stage');
        plantStage.className = `plant-stage ${currentStage.class}`;

        // Update progress bar
        const progress = this.getProgress();
        this.progressFillElement.style.width = `${progress}%`;

        const nextStage = this.getNextStage();
        if (nextStage) {
            const daysNeeded = nextStage.minDays - this.currentDay;
            this.progressTextElement.textContent = `${Math.round(progress)}% to ${nextStage.name} (${daysNeeded} days)`;
        } else {
            this.progressTextElement.textContent = '100% - Fully Grown! 🎉';
        }

        // Update last check-in
        if (this.lastCheckIn) {
            const date = new Date(this.lastCheckIn);
            this.lastCheckInElement.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        // Update button states
        document.getElementById('waterBtn').disabled = this.todayWatered;
        document.getElementById('careBtn').disabled = this.todayCared;
        document.getElementById('checkInBtn').disabled = this.todayCheckedIn;

        // Update history
        this.updateHistory();
    }

    getHealthStatus() {
        const totalCare = this.waterCount + this.careCount;
        const careRatio = this.currentDay > 0 ? totalCare / this.currentDay : 0;

        if (careRatio >= 1.5) return '🌟🌟🌟';
        if (careRatio >= 1.0) return '🌟🌟';
        if (careRatio >= 0.5) return '🌟';
        return '⭐';
    }

    updateHistory() {
        this.historyLogElement.innerHTML = '';

        // Show most recent 10 items
        const recentHistory = this.history.slice(-10).reverse();

        if (recentHistory.length === 0) {
            this.historyLogElement.innerHTML = '<p class="history-item">🌱 Your journey begins...</p>';
            return;
        }

        recentHistory.forEach(item => {
            const p = document.createElement('p');
            p.className = 'history-item';
            p.textContent = item;
            this.historyLogElement.appendChild(p);
        });
    }

    addHistory(message) {
        const timestamp = new Date().toLocaleString();
        this.history.push(`${message} - ${timestamp}`);

        // Keep only last 50 items
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
        }
    }

    showMessage(message) {
        this.messageElement.textContent = message;
    }

    celebrate() {
        this.plantElement.classList.add('celebrate');
        setTimeout(() => {
            this.plantElement.classList.remove('celebrate');
        }, 500);
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset your progress? This cannot be undone!')) {
            localStorage.removeItem('plantTrackerData');
            this.resetData();
            this.saveData();
            this.updateUI();
            this.showMessage('🔄 Progress reset. Start your new journey!');
            this.addHistory('🔄 Started a new journey');
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new PlantTracker();
});

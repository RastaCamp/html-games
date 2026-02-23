/**
 * 7 DAYS... - WEATHER SYSTEM
 * 
 * 🌤️ WHAT IS THIS FILE?
 * This manages weather and seasons. Each day, it rolls for weather based on the season.
 * Weather affects temperature, water availability, morale, and more!
 * 
 * 🎯 SEASONS:
 * - Spring: Mild, rainy, good for rabbits
 * - Summer: Hot, dry, long days (easiest)
 * - Fall: Cool, moderate rain, high mouse activity
 * - Winter: Freezing, snow, short days, scarce food (hardest)
 * 
 * 💡 WANT TO ADD A NEW SEASON?
 * 1. Add it to updateSeasonalBaselines()
 * 2. Add weather table in rollDailyWeather()
 * 3. Update season selection in index.html
 * 4. Test it!
 * 
 * 🎨 WEATHER EFFECTS:
 * - Rain: Provides water (good!) but can flood (bad!)
 * - Snow: Provides water if melted, but very cold
 * - Heat wave: Extra thirst, food spoils faster
 * - Blizzard: Extreme cold, but mongrels hide (safer!)
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to update all season-related methods
 * - Not handling edge cases (what if no rain for 10 days?)
 */

class WeatherSystem {
    constructor() {
        // 🌍 INITIAL STATE: Default to summer (easiest season)
        this.season = 'summer'; // 'spring', 'summer', 'fall', 'winter'
        this.currentWeather = 'sunny'; // Current weather condition
        this.temperature = 75; // Fahrenheit (because America)
        this.daylightHours = 14; // How long is the day? (affects visibility)
        this.rainfall = 0; // How much rain this day? (affects water collection)
        this.daysWithoutRain = 0; // Drought tracker (no rain = bad for water)
        this.weatherHistory = []; // Log of past weather (for debugging/fun)
    }

    setSeason(season) {
        this.season = season;
        this.updateSeasonalBaselines();
    }

    updateSeasonalBaselines() {
        const baselines = {
            spring: {
                dayTemp: 55,
                nightTemp: 45,
                daylightHours: 13,
                rainChance: 0.6
            },
            summer: {
                dayTemp: 80,
                nightTemp: 65,
                daylightHours: 15,
                rainChance: 0.2
            },
            fall: {
                dayTemp: 50,
                nightTemp: 40,
                daylightHours: 11,
                rainChance: 0.4
            },
            winter: {
                dayTemp: 30,
                nightTemp: 20,
                daylightHours: 9,
                rainChance: 0.3
            }
        };

        const baseline = baselines[this.season] || baselines.summer;
        this.temperature = baseline.dayTemp;
        this.daylightHours = baseline.daylightHours;
    }

    rollDailyWeather() {
        const roll = Math.random() * 100;
        let weather = 'sunny';
        let tempModifier = 0;
        let moraleModifier = 0;
        let waterYield = 0;

        if (this.season === 'spring') {
            if (roll <= 40) {
                weather = 'rain';
                waterYield = 5;
                moraleModifier = -5;
            } else if (roll <= 70) {
                weather = 'overcast';
                tempModifier = -5;
                moraleModifier = -2;
            } else if (roll <= 90) {
                weather = 'partly_cloudy';
            } else {
                weather = 'sunny';
                moraleModifier = 5;
                tempModifier = 5;
            }
        } else if (this.season === 'summer') {
            if (roll <= 20) {
                weather = 'rain';
                waterYield = 5;
                moraleModifier = 5; // Exciting!
            } else if (roll <= 50) {
                weather = 'hot_dry';
                tempModifier = 5;
            } else if (roll <= 80) {
                weather = 'sunny';
                moraleModifier = 2;
            } else {
                weather = 'heat_wave';
                tempModifier = 10;
                moraleModifier = -5;
            }
        } else if (this.season === 'fall') {
            if (roll <= 40) {
                weather = 'rain';
                waterYield = 5;
                moraleModifier = -2;
            } else if (roll <= 60) {
                weather = 'windy';
                tempModifier = -5;
            } else if (roll <= 80) {
                weather = 'crisp_clear';
                moraleModifier = 2;
            } else {
                weather = 'cold_snap';
                tempModifier = -10;
            }
        } else if (this.season === 'winter') {
            if (roll <= 30) {
                weather = 'snow';
                waterYield = 3; // If melted
                tempModifier = -5;
                moraleModifier = -3;
            } else if (roll <= 50) {
                weather = 'blizzard';
                tempModifier = -15;
                moraleModifier = -10;
            } else if (roll <= 70) {
                weather = 'bitter_cold';
                tempModifier = -10;
            } else if (roll <= 90) {
                weather = 'clear_cold';
                moraleModifier = -2;
            } else {
                weather = 'freezing_rain';
                tempModifier = -5;
            }
        }

        this.currentWeather = weather;
        this.temperature += tempModifier;
        
        if (weather === 'rain' || weather === 'snow') {
            this.daysWithoutRain = 0;
            this.rainfall = waterYield;
        } else {
            this.daysWithoutRain++;
            this.rainfall = 0;
        }

        // Check for drought
        if (this.daysWithoutRain >= 5) {
            if (window.game) {
                window.game.addMessage('Extended dry spell. Water becomes precious.');
            }
        }

        // Check for flood (heavy rain)
        if (weather === 'rain' && waterYield >= 8) {
            if (window.game) {
                window.game.addMessage('Heavy rain! Window well may flood.');
            }
        }

        this.weatherHistory.push({
            day: window.game ? window.game.dayCycle.currentDay : 1,
            weather: weather,
            temperature: this.temperature,
            rainfall: waterYield
        });

        return {
            weather: weather,
            temperature: this.temperature,
            rainfall: waterYield,
            moraleModifier: moraleModifier,
            tempModifier: tempModifier
        };
    }

    getWeatherIcon() {
        const icons = {
            'sunny': '☀️',
            'partly_cloudy': '⛅',
            'overcast': '☁️',
            'rain': '🌧️',
            'thunderstorm': '⛈️',
            'snow': '🌨️',
            'blizzard': '❄️',
            'heat_wave': '🔥',
            'windy': '💨',
            'crisp_clear': '☀️',
            'cold_snap': '❄️',
            'bitter_cold': '🧊',
            'clear_cold': '☀️',
            'freezing_rain': '🌧️',
            'hot_dry': '☀️'
        };
        return icons[this.currentWeather] || '☀️';
    }

    getTemperatureColor(overrideTemp) {
        const t = overrideTemp != null ? overrideTemp : this.temperature;
        if (t >= 70) return '#ffaa44'; // Orange (hot)
        if (t >= 60) return '#44ff88'; // Green (comfortable)
        if (t >= 50) return '#ffff44'; // Yellow (chilly)
        if (t >= 40) return '#ff8844'; // Orange (cold)
        if (t >= 30) return '#ff4444'; // Red (very cold)
        return '#8844ff'; // Blue (freezing)
    }

    getTemperatureEffect() {
        if (this.temperature >= 70) {
            return { hungerModifier: 1.1, healthDrain: 0, description: 'Warm' };
        } else if (this.temperature >= 60) {
            return { hungerModifier: 1.0, healthDrain: 0, description: 'Comfortable' };
        } else if (this.temperature >= 50) {
            return { hungerModifier: 1.1, healthDrain: 0, description: 'Chilly' };
        } else if (this.temperature >= 40) {
            return { hungerModifier: 1.2, healthDrain: 1, description: 'Cold' };
        } else if (this.temperature >= 30) {
            return { hungerModifier: 1.3, healthDrain: 2, description: 'Very Cold' };
        } else {
            return { hungerModifier: 1.4, healthDrain: 3, description: 'Freezing' };
        }
    }

    getRabbitSuccessChance() {
        const chances = {
            spring: 0.7,
            summer: 0.5,
            fall: 0.6,
            winter: 0.3
        };
        return chances[this.season] || 0.5;
    }

    getMouseSpawnRate() {
        const rates = {
            spring: 1.0,
            summer: 0.7,
            fall: 1.2,
            winter: 0.5
        };
        return rates[this.season] || 1.0;
    }

    getSproutGrowthTime() {
        const times = {
            spring: 3,
            summer: 4,
            fall: 3,
            winter: 5
        };
        return times[this.season] || 3;
    }

    getMongrelActivity() {
        const weather = this.currentWeather;
        if (weather === 'blizzard' || weather === 'thunderstorm') return 0; // They hide
        if (weather === 'snow' || weather === 'bitter_cold') return 1.5; // Desperate
        if (this.season === 'winter') return 1.2; // Hungry
        if (this.season === 'summer' && weather === 'heat_wave') return 0.5; // Too hot
        return 1.0; // Normal
    }

    getState() {
        return {
            season: this.season,
            currentWeather: this.currentWeather,
            temperature: this.temperature,
            daylightHours: this.daylightHours,
            rainfall: this.rainfall,
            daysWithoutRain: this.daysWithoutRain
        };
    }

    setState(state) {
        this.season = state.season || 'summer';
        this.currentWeather = state.currentWeather || 'sunny';
        this.temperature = state.temperature || 75;
        this.daylightHours = state.daylightHours || 14;
        this.rainfall = state.rainfall || 0;
        this.daysWithoutRain = state.daysWithoutRain || 0;
        this.updateSeasonalBaselines();
    }
}

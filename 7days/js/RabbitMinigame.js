/**
 * 7 DAYS... - RABBIT HARVESTING MINIGAME
 * 
 * 🐇 WHAT IS THIS FILE?
 * A 4-step multiple choice quiz for processing a rabbit.
 * Each correct answer advances to the next stage picture.
 * Final yield based on performance (4/4 = perfect, 0/4 = failed).
 * 
 * 📝 HOW IT WORKS:
 * 1. Player catches rabbit (event or snare)
 * 2. Minigame starts with timer music
 * 3. 4 questions, each with correct answer and wrong options
 * 4. Each correct answer advances picture (whole → skinned → eviscerated → butchered)
 * 5. Final yield calculated based on correct answers
 * 
 * 🎯 YIELD SYSTEM:
 * - 4/4 correct: 3 meat + all bones + pristine pelt + usable organs
 * - 3/4 correct: 2 meat + some bones + usable pelt + damaged organs
 * - 2/4 correct: 1 meat + few bones + torn pelt + organs ruined
 * - 1/4 or 0/4: 0 meat (inedible) + scattered bones + ruined pelt + no organs
 * 
 * 💡 WANT TO TWEAK IT?
 * - Adjust questions/answers in `this.questions`
 * - Change yield amounts in `calculateYield()`
 * - Modify timer duration or difficulty
 * 
 * 🐛 COMMON MISTAKES:
 * - Forgetting to play timer music
 * - Not advancing picture on correct answer
 * - Yield calculation errors
 */

class RabbitMinigame {
    constructor() {
        this.currentStep = 0; // 0-3 (4 steps)
        this.correctAnswers = 0;
        this.questions = [
            {
                step: 1,
                question: "What's the first thing you do?",
                correct: "Skin it",
                wrong: ["Cook it", "Soak it", "Bury it"],
                image: 'VISUALS/rabbit/rabbit_left.PNG' // Use existing rabbit image (freshly caught)
            },
            {
                step: 2,
                question: "Next you need to remove the...",
                correct: "Organs / Guts",
                wrong: ["Bones", "Head", "Fur"],
                image: 'VISUALS/rabbit/rabbit_right.PNG' // Use existing rabbit image (processing stage)
            },
            {
                step: 3,
                question: "Now separate the...",
                correct: "Meat from bones",
                wrong: ["Skin from meat", "Organs from guts", "Head from body"],
                image: 'VISUALS/rabbit/rabbit_defeated.PNG' // Use existing rabbit image (eviscerated)
            },
            {
                step: 4,
                question: "Finally, save the...",
                correct: "Bones and pelt",
                wrong: ["Feet and head", "Blood", "Everything else"],
                image: 'VISUALS/rabbit/rabbit_defeated.PNG' // Use existing rabbit image (butchered)
            }
        ];
        this.timerMusic = null; // Audio element for timer music
        this.isActive = false;
    }

    start(game) {
        // 🎮 START MINIGAME: Initialize the rabbit processing quiz
        this.isActive = true;
        this.currentStep = 0;
        this.correctAnswers = 0;
        
        // Play timer music (looping)
        this.playTimerMusic();
        
        // Show minigame UI
        this.showMinigameUI(game);
        
        // Load first question
        this.loadQuestion(0, game);
    }

    playTimerMusic() {
        // 🔊 PLAY TIMER MUSIC: Looping tense track
        if (window.audioSystem) {
            window.audioSystem.playMusic('time_thinking', true);
            this.timerMusic = window.audioSystem.music; // Store reference
        } else {
            // Fallback to direct audio
            if (this.timerMusic) {
                this.timerMusic.pause();
                this.timerMusic.currentTime = 0;
            }
            this.timerMusic = new Audio('sounds/time_thinking.mp3');
            this.timerMusic.loop = true;
            this.timerMusic.volume = 0.5;
            this.timerMusic.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    stopTimerMusic() {
        // 🛑 STOP TIMER MUSIC
        if (window.audioSystem) {
            window.audioSystem.stopMusic();
        } else if (this.timerMusic) {
            this.timerMusic.pause();
            this.timerMusic.currentTime = 0;
        }
    }

    showMinigameUI(game) {
        // 🎨 SHOW MINIGAME UI: Create modal overlay for quiz
        let minigameEl = document.getElementById('rabbit-minigame');
        if (!minigameEl) {
            minigameEl = document.createElement('div');
            minigameEl.id = 'rabbit-minigame';
            minigameEl.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: 'Courier New', monospace;
            `;
            document.body.appendChild(minigameEl);
        }
        
        minigameEl.classList.remove('hidden');
    }

    loadQuestion(stepIndex, game) {
        // 📋 LOAD QUESTION: Display current step's question and options
        const question = this.questions[stepIndex];
        if (!question) return;
        
        const minigameEl = document.getElementById('rabbit-minigame');
        if (!minigameEl) return;
        
        // Create question HTML
        minigameEl.innerHTML = `
            <div style="text-align: center; max-width: 800px;">
                <h2 style="margin-bottom: 20px;">PROCESSING RABBIT - STEP ${question.step}/4</h2>
                <img id="rabbit-image" src="${question.image}" style="max-width: 400px; max-height: 300px; margin: 20px 0; border: 2px solid #666;" onerror="this.style.display='none'">
                <p style="font-size: 18px; margin: 20px 0;">${question.question}</p>
                <div id="answer-buttons" style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
                    ${this.createAnswerButtons(question)}
                </div>
            </div>
        `;
        
        // Add click handlers
        this.attachAnswerHandlers(stepIndex, game);
    }

    createAnswerButtons(question) {
        // 🎯 CREATE ANSWER BUTTONS: Mix correct and wrong answers
        const allAnswers = [question.correct, ...question.wrong];
        // Shuffle answers
        for (let i = allAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }
        
        return allAnswers.map(answer => `
            <button class="answer-btn" data-answer="${answer}" style="
                padding: 15px 30px;
                font-size: 16px;
                background: #333;
                color: white;
                border: 2px solid #666;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s;
            " onmouseover="this.style.background='#444'" onmouseout="this.style.background='#333'">
                ${answer}
            </button>
        `).join('');
    }

    attachAnswerHandlers(stepIndex, game) {
        // 🖱️ ATTACH HANDLERS: Handle answer clicks
        const buttons = document.querySelectorAll('.answer-btn');
        const question = this.questions[stepIndex];
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.dataset.answer;
                const isCorrect = answer === question.correct;
                
                // Play sound
                this.playAnswerSound(isCorrect);
                
                // Disable buttons
                buttons.forEach(b => b.disabled = true);
                
                // Show feedback
                if (isCorrect) {
                    btn.style.background = '#4CAF50';
                    this.correctAnswers++;
                } else {
                    btn.style.background = '#f44336';
                }
                
                // Advance to next step or finish
                setTimeout(() => {
                    if (stepIndex < 3) {
                        this.loadQuestion(stepIndex + 1, game);
                    } else {
                        this.finish(game);
                    }
                }, 1000);
            });
        });
    }

    playAnswerSound(isCorrect) {
        // 🔊 PLAY ANSWER SOUND: Correct or wrong feedback
        if (window.audioSystem) {
            window.audioSystem.playSound(isCorrect ? 'correct' : 'no');
        } else {
            // Fallback
            const sound = new Audio(isCorrect ? 'sounds/correct.mp3' : 'sounds/no.mp3');
            sound.volume = 0.7;
            sound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    finish(game) {
        // 🏁 FINISH MINIGAME: Calculate yield and give items
        this.stopTimerMusic();
        this.isActive = false;
        
        const yieldResult = this.calculateYield();
        
        // Play finish sound
        if (window.audioSystem) {
            window.audioSystem.playSound(yieldResult.meat > 0 ? 'positive' : 'negative');
        } else {
            // Fallback
            const sound = new Audio(yieldResult.meat > 0 ? 'sounds/positive_advance.mp3' : 'sounds/negative.mp3');
            sound.play().catch(e => console.log('Audio play failed:', e));
        }
        
        // Give items to player
        this.giveYield(yieldResult, game);
        
        // Show results
        this.showResults(yieldResult, game);
    }

    calculateYield() {
        // 📊 CALCULATE YIELD: Based on correct answers
        const correct = this.correctAnswers;
        
        if (correct === 4) {
            // Perfect: 3 meat + all bones + pristine pelt + usable organs
            return {
                meat: 3,
                bones: 5,
                pelt: { condition: 'pristine', quantity: 1 },
                organs: { usable: true, quantity: 1 }
            };
        } else if (correct === 3) {
            // Good: 2 meat + some bones + usable pelt + damaged organs
            return {
                meat: 2,
                bones: 3,
                pelt: { condition: 'usable', quantity: 1 },
                organs: { usable: false, quantity: 1 }
            };
        } else if (correct === 2) {
            // Poor: 1 meat + few bones + torn pelt + organs ruined
            return {
                meat: 1,
                bones: 1,
                pelt: { condition: 'torn', quantity: 1 },
                organs: { usable: false, quantity: 0 }
            };
        } else {
            // Failed: 0 meat (inedible) + scattered bones + ruined pelt + no organs
            return {
                meat: 0,
                bones: 0,
                pelt: { condition: 'ruined', quantity: 0 },
                organs: { usable: false, quantity: 0 }
            };
        }
    }

    giveYield(yieldData, game) {
        // 🎁 GIVE YIELD: Add items to inventory
        if (!game || !game.inventory || !game.itemSystem) return;
        
        // Add meat
        for (let i = 0; i < yieldData.meat; i++) {
            const meat = game.itemSystem.createItem('rabbit_meat');
            if (meat) {
                game.inventory.addItem(meat, 1);
            }
        }
        
        // Add bones
        for (let i = 0; i < yieldData.bones; i++) {
            const bone = game.itemSystem.createItem('bone');
            if (bone) {
                game.inventory.addItem(bone, 1);
            }
        }
        
        // Add pelt
        if (yieldData.pelt.quantity > 0) {
            const pelt = game.itemSystem.createItem('rabbit_pelt');
            if (pelt) {
                pelt.condition = yieldData.pelt.condition;
                game.inventory.addItem(pelt, yieldData.pelt.quantity);
            }
        }
        
        // Add organs (if usable)
        if (yieldData.organs.usable && yieldData.organs.quantity > 0) {
            const organs = game.itemSystem.createItem('rabbit_organs');
            if (organs) {
                game.inventory.addItem(organs, yieldData.organs.quantity);
            }
        }
    }

    showResults(yieldData, game) {
        // 📊 SHOW RESULTS: Display final yield and message
        const minigameEl = document.getElementById('rabbit-minigame');
        if (!minigameEl) return;
        
        let message = '';
        if (yieldData.meat === 0) {
            message = 'You butchered it. Literally. Nothing usable remains.';
        } else if (yieldData.meat === 3) {
            message = 'Perfect! You processed the rabbit expertly. 3 portions of meat, bones, pelt, and organs.';
        } else if (yieldData.meat === 2) {
            message = 'Good job! You got 2 portions of meat, some bones, and a usable pelt.';
        } else {
            message = 'You managed to salvage 1 portion of meat, but made some mistakes.';
        }
        
        minigameEl.innerHTML = `
            <div style="text-align: center; max-width: 800px;">
                <h2 style="margin-bottom: 20px;">PROCESSING COMPLETE</h2>
                <p style="font-size: 18px; margin: 20px 0;">${message}</p>
                <div style="margin: 20px 0;">
                    <p>Meat: ${yieldData.meat} portions</p>
                    <p>Bones: ${yieldData.bones}</p>
                    <p>Pelt: ${yieldData.pelt.condition} (${yieldData.pelt.quantity})</p>
                    <p>Organs: ${yieldData.organs.usable ? 'Usable' : 'Ruined'} (${yieldData.organs.quantity})</p>
                </div>
                <button id="close-minigame-btn" style="
                    padding: 15px 30px;
                    font-size: 16px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                ">CONTINUE</button>
            </div>
        `;
        
        // Close button
        document.getElementById('close-minigame-btn').addEventListener('click', () => {
            minigameEl.classList.add('hidden');
            if (game) {
                game.addMessage(message);
            }
        });
    }
}

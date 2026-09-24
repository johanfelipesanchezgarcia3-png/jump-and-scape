// Motor de Juego Canvas 2D - "Escapa y Aprende"

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Configuración de pantalla física/virtual
        this.width = 1000;
        this.height = 500;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Estado del juego
        this.state = 'MENU'; // MENU, AVATAR, PLAYING, TRIVIA, HIGHSCORE_INPUT, GAMEOVER, LEADERBOARD
        this.currentSubject = 'matematicas';
        this.selectedAvatar = 'alex'; // alex, maya, volt
        
        // Avatares y atributos pasivos
        this.avatars = {
            alex: { name: 'Alex El Explorador', trait: '🛡️ Inicia con Escudo Extra', icon: '🤠', shieldBonus: true, scoreMult: 1.0, jumpBonus: 0 },
            maya: { name: 'Maya La Científica', trait: '⭐ +50% Puntos por Orbes/Trivia', icon: '👩‍🔬', shieldBonus: false, scoreMult: 1.5, jumpBonus: 0 },
            volt: { name: 'Volt El Ciber-Estudiante', trait: '⚡ Salto Doble Potenciado', icon: '🤖', shieldBonus: false, scoreMult: 1.0, jumpBonus: -2 }
        };

        // Físicas del Jugador
        this.player = {
            x: 150,
            y: 350,
            width: 44,
            height: 60,
            vy: 0,
            gravity: 0.65,
            jumpForce: -13.5,
            isGrounded: false,
            doubleJumpAvailable: true,
            isShielded: false,
            invincibleTimer: 0,
            frame: 0
        };

        // Perseguidor ("La Sombra de la Ignorancia")
        this.chaser = {
            distancePercent: 15, // 0% lejos, 100% atrapado
            x: 30
        };

        // Entidades de la carrera
        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];
        this.bgStars = [];

        // Parámetros de juego
        this.score = 0;
        this.lives = 3;
        this.combo = 1;
        this.speed = 6;
        this.distance = 0;
        this.obstacleSpawnTimer = 0;
        this.collectibleSpawnTimer = 0;

        // Gestión de Preguntas
        this.activeQuestion = null;
        this.questionPool = [];
        this.answeredQuestions = []; // Para la pantalla de revisión final
        this.triviaTimerId = null;
        this.triviaTimeRemaining = 15;

        // High Scores persitentes (Top 5 por materia)
        this.leaderboards = this.loadLeaderboards();

        this.initEvents();
        this.initStars();
        this.renderLoop();
    }

    initStars() {
        this.bgStars = [];
        for (let i = 0; i < 60; i++) {
            this.bgStars.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height - 120),
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.2
            });
        }
    }

    loadLeaderboards() {
        const stored = localStorage.getItem('escapa_aprende_top5_v1');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        // Datos por defecto
        return {
            matematicas: [
                { name: 'Prof. Gauss', score: 2400, date: '2026-08-01' },
                { name: 'Ana M.', score: 1800, date: '2026-08-02' },
                { name: 'Lucas', score: 1200, date: '2026-08-03' },
                { name: 'Sofi', score: 800, date: '2026-08-04' },
                { name: 'Mateo', score: 500, date: '2026-08-05' }
            ],
            espanol: [
                { name: 'Cervantes', score: 2500, date: '2026-08-01' },
                { name: 'Gabriela', score: 1900, date: '2026-08-02' },
                { name: 'Carlos', score: 1300, date: '2026-08-03' },
                { name: 'Elena', score: 900, date: '2026-08-04' },
                { name: 'David', score: 600, date: '2026-08-05' }
            ],
            biologia: [
                { name: 'Darwin', score: 2600, date: '2026-08-01' },
                { name: 'Mendel', score: 2000, date: '2026-08-02' },
                { name: 'Camila', score: 1400, date: '2026-08-03' },
                { name: 'Jorge', score: 1000, date: '2026-08-04' },
                { name: 'Valeria', score: 700, date: '2026-08-05' }
            ],
            ingles: [
                { name: 'Shakespeare', score: 2700, date: '2026-08-01' },
                { name: 'Emma W.', score: 2100, date: '2026-08-02' },
                { name: 'Liam', score: 1500, date: '2026-08-03' },
                { name: 'Noah', score: 1100, date: '2026-08-04' },
                { name: 'Olivia', score: 750, date: '2026-08-05' }
            ]
        };
    }

    saveLeaderboards() {
        localStorage.setItem('escapa_aprende_top5_v1', JSON.stringify(this.leaderboards));
    }

    initEvents() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                if (this.state === 'PLAYING') {
                    this.jump();
                    e.preventDefault();
                }
            }
        });

        // Touch / Click en pantalla de juego
        const canvasContainer = document.getElementById('canvas-container');
        canvasContainer.addEventListener('pointerdown', (e) => {
            if (this.state === 'PLAYING') {
                this.jump();
            }
        });

        const touchBtn = document.getElementById('touch-jump-btn');
        if (touchBtn) {
            touchBtn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                if (this.state === 'PLAYING') {
                    this.jump();
                }
            });
        }

        // Eventos UI de Selección de Materia
        document.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', () => {
                this.currentSubject = card.getAttribute('data-subject');
                soundEngine.playCollect();
                this.showScreen('avatar-screen');
            });
        });

        // Eventos UI de Selección de Avatar
        document.querySelectorAll('.avatar-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedAvatar = card.getAttribute('data-avatar');
                soundEngine.playCollect();
            });
        });

        document.getElementById('btn-start-game').addEventListener('click', () => {
            soundEngine.playCollect();
            this.startGame();
        });

        document.getElementById('btn-back-subject').addEventListener('click', () => {
            soundEngine.playCollect();
            this.showScreen('menu-screen');
        });

        document.getElementById('btn-show-leaderboard').addEventListener('click', () => {
            soundEngine.playCollect();
            this.updateLeaderboardUI('matematicas');
            this.showScreen('leaderboard-screen');
        });

        document.getElementById('btn-back-menu').addEventListener('click', () => {
            soundEngine.playCollect();
            this.showScreen('menu-screen');
        });

        // Tabs del Leaderboard
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const subj = btn.getAttribute('data-tab');
                soundEngine.playCollect();
                this.updateLeaderboardUI(subj);
            });
        });

        // Toggle Sonido / Música
        document.getElementById('btn-toggle-sound').addEventListener('click', (e) => {
            const enabled = soundEngine.toggleSound();
            e.target.innerText = enabled ? '🔊' : '🔇';
        });

        document.getElementById('btn-toggle-music').addEventListener('click', (e) => {
            const enabled = soundEngine.toggleMusic();
            e.target.innerText = enabled ? '🎵' : '🔇';
        });

        // Guardar High Score
        document.getElementById('btn-save-score').addEventListener('click', () => {
            this.submitHighScore();
        });

        // Botones de Game Over
        document.getElementById('btn-play-again').addEventListener('click', () => {
            soundEngine.playCollect();
            this.startGame();
        });

        document.getElementById('btn-gameover-menu').addEventListener('click', () => {
            soundEngine.playCollect();
            this.showScreen('menu-screen');
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');

        if (screenId === 'game-screen') {
            this.state = 'PLAYING';
        } else {
            this.state = 'MENU';
        }
    }

    startGame() {
        this.showScreen('game-screen');
        this.score = 0;
        this.lives = 3;
        this.combo = 1;
        this.speed = 6;
        this.distance = 0;
        this.obstacles = [];
        this.collectibles = [];
        this.particles = [];
        this.answeredQuestions = [];
        this.chaser.distancePercent = 15;

        // Reset del Jugador
        this.player.y = this.height - 120;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.doubleJumpAvailable = true;
        this.player.invincibleTimer = 0;
        
        // Bonus pasivos de avatar
        const avatarData = this.avatars[this.selectedAvatar];
        this.player.isShielded = avatarData.shieldBonus;

        // Mezclar banco de preguntas para la materia seleccionada (Algoritmo Fisher-Yates)
        this.questionPool = [...QUESTION_BANK[this.currentSubject]];
        for (let i = this.questionPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questionPool[i], this.questionPool[j]] = [this.questionPool[j], this.questionPool[i]];
        }

        this.updateHUD();
        soundEngine.startMusic();
    }

    jump() {
        const avatarData = this.avatars[this.selectedAvatar];
        const extraForce = avatarData.jumpBonus || 0;

        if (this.player.isGrounded) {
            this.player.vy = this.player.jumpForce + extraForce;
            this.player.isGrounded = false;
            this.player.doubleJumpAvailable = true;
            soundEngine.playJump();
            this.createDustParticles(this.player.x + 20, this.player.y + 60);
        } else if (this.player.doubleJumpAvailable) {
            this.player.vy = (this.player.jumpForce + extraForce) * 0.9;
            this.player.doubleJumpAvailable = false;
            soundEngine.playDoubleJump();
            this.createDustParticles(this.player.x + 20, this.player.y + 30, '#00f0ff');
        }
    }

    createDustParticles(x, y, color = '#ffffff') {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 2 - 1,
                size: Math.random() * 4 + 2,
                color: color,
                life: 1.0
            });
        }
    }

    updateHUD() {
        document.getElementById('hud-score').innerText = Math.floor(this.score);
        document.getElementById('hud-lives').innerText = '❤️'.repeat(this.lives);
        document.getElementById('hud-combo').innerText = `x${this.combo}`;
        document.getElementById('hud-subject').innerText = this.currentSubject.toUpperCase();
        
        const chaserFill = document.getElementById('chaser-fill');
        if (chaserFill) {
            chaserFill.style.width = `${Math.min(100, Math.max(0, this.chaser.distancePercent))}%`;
        }
    }

    spawnObstacle() {
        const types = ['spike', 'laser', 'drone'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let obs = {
            x: this.width + 50,
            y: this.height - 110,
            width: 35,
            height: 45,
            type: type
        };

        if (type === 'laser') {
            obs.height = 70;
            obs.y = this.height - 130;
        } else if (type === 'drone') {
            obs.width = 40;
            obs.height = 35;
            obs.y = this.height - 170; // Requiere agacharse o salto bien calculado
        }

        this.obstacles.push(obs);
    }

    spawnCollectible() {
        const types = ['orb', 'shield'];
        const rand = Math.random();
        const type = rand > 0.8 ? 'shield' : 'orb';

        this.collectibles.push({
            x: this.width + 50,
            y: this.height - 150 - Math.random() * 100,
            size: 15,
            type: type,
            pulse: 0
        });
    }

    update() {
        if (this.state !== 'PLAYING') return;

        // Aceleración paulatina de la carrera
        this.speed = 6 + Math.floor(this.score / 500) * 0.5;
        this.distance += this.speed * 0.1;

        // Físicas del jugador
        this.player.vy += this.player.gravity;
        this.player.y += this.player.vy;

        const groundLevel = this.height - 110;
        if (this.player.y >= groundLevel - this.player.height) {
            this.player.y = groundLevel - this.player.height;
            this.player.vy = 0;
            this.player.isGrounded = true;
        }

        if (this.player.invincibleTimer > 0) {
            this.player.invincibleTimer--;
        }

        // Perseguidor (acercamiento lento constante si no hay aciertos)
        this.chaser.distancePercent += 0.01;
        if (this.chaser.distancePercent >= 100) {
            this.triggerGameOver('¡La Sombra de la Ignorancia te atrapó!');
            return;
        }

        // Generar Obstáculos
        this.obstacleSpawnTimer++;
        if (this.obstacleSpawnTimer > Math.max(70, 150 - this.speed * 8)) {
            this.spawnObstacle();
            this.obstacleSpawnTimer = 0;
        }

        // Generar Orbes
        this.collectibleSpawnTimer++;
        if (this.collectibleSpawnTimer > 120) {
            if (Math.random() > 0.4) this.spawnCollectible();
            this.collectibleSpawnTimer = 0;
        }

        // Actualizar Obstáculos y Colisión
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            let obs = this.obstacles[i];
            obs.x -= this.speed;

            // Detección de Colisión AABB
            if (this.player.invincibleTimer === 0 &&
                this.player.x < obs.x + obs.width &&
                this.player.x + this.player.width > obs.x &&
                this.player.y < obs.y + obs.height &&
                this.player.y + this.player.height > obs.y) {
                
                // Si tiene escudo de energía consumible
                if (this.player.isShielded) {
                    this.player.isShielded = false;
                    this.player.invincibleTimer = 60;
                    this.obstacles.splice(i, 1);
                    soundEngine.playHit();
                    this.createDustParticles(obs.x, obs.y, '#00f0ff');
                } else {
                    // ¡Colisión con Obstáculo! -> Disparar Modal de Trivia Educativa
                    this.obstacles.splice(i, 1);
                    this.triggerTrivia(obs);
                    return;
                }
            }

            if (obs.x + obs.width < 0) {
                this.obstacles.splice(i, 1);
                // Puntaje por esquivar
                const mult = this.avatars[this.selectedAvatar].scoreMult;
                this.score += 20 * this.combo * mult;
            }
        }

        // Actualizar Orbes Collectibles
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            let col = this.collectibles[i];
            col.x -= this.speed;
            col.pulse += 0.1;

            // Distancia al jugador
            const dx = (this.player.x + 20) - col.x;
            const dy = (this.player.y + 30) - col.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 40) {
                if (col.type === 'orb') {
                    const mult = this.avatars[this.selectedAvatar].scoreMult;
                    this.score += 100 * mult;
                    soundEngine.playCollect();
                    this.createDustParticles(col.x, col.y, '#ffd700');
                } else if (col.type === 'shield') {
                    this.player.isShielded = true;
                    soundEngine.playShield();
                    this.createDustParticles(col.x, col.y, '#00f0ff');
                }
                this.collectibles.splice(i, 1);
            } else if (col.x < -20) {
                this.collectibles.splice(i, 1);
            }
        }

        // Actualizar Partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.04;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        this.updateHUD();
    }

    triggerTrivia(collidedObstacle) {
        this.state = 'TRIVIA';
        soundEngine.playHit();

        // Obtener siguiente pregunta del pool
        if (this.questionPool.length === 0) {
            // Reiniciar pool si se agotan
            this.questionPool = [...QUESTION_BANK[this.currentSubject]];
        }
        this.activeQuestion = this.questionPool.pop();

        // Renderizar modal de trivia
        const modal = document.getElementById('trivia-modal');
        const questionText = document.getElementById('trivia-question-text');
        const optionsGrid = document.getElementById('trivia-options-grid');
        const explanationBox = document.getElementById('trivia-explanation');
        const subjectTag = document.getElementById('trivia-subject-tag');

        subjectTag.innerText = this.currentSubject.toUpperCase();
        questionText.innerText = this.activeQuestion.q;
        optionsGrid.innerHTML = '';
        explanationBox.classList.remove('active');
        explanationBox.innerText = '';

        const letters = ['A', 'B', 'C', 'D'];
        this.activeQuestion.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-badge">${letters[idx]}</span> <span>${opt}</span>`;
            btn.addEventListener('click', () => this.handleTriviaAnswer(idx));
            optionsGrid.appendChild(btn);
        });

        modal.classList.add('active');

        // Timer de 15 segundos
        this.triviaTimeRemaining = 15;
        document.getElementById('trivia-timer').innerText = `⏱️ ${this.triviaTimeRemaining}s`;
        
        clearInterval(this.triviaTimerId);
        this.triviaTimerId = setInterval(() => {
            this.triviaTimeRemaining--;
            document.getElementById('trivia-timer').innerText = `⏱️ ${this.triviaTimeRemaining}s`;
            if (this.triviaTimeRemaining <= 0) {
                clearInterval(this.triviaTimerId);
                this.handleTriviaAnswer(-1); // Tiempo agotado
            }
        }, 1000);
    }

    handleTriviaAnswer(selectedIndex) {
        clearInterval(this.triviaTimerId);
        const modal = document.getElementById('trivia-modal');
        const optionsGrid = document.getElementById('trivia-options-grid');
        const explanationBox = document.getElementById('trivia-explanation');
        const isCorrect = (selectedIndex === this.activeQuestion.answer);

        // Deshabilitar todos los botones
        const buttons = optionsGrid.querySelectorAll('.option-btn');
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === this.activeQuestion.answer) {
                btn.classList.add('correct');
            } else if (idx === selectedIndex) {
                btn.classList.add('wrong');
            }
        });

        // Guardar para revisión post-juego
        this.answeredQuestions.push({
            question: this.activeQuestion.q,
            userAnswer: selectedIndex >= 0 ? this.activeQuestion.options[selectedIndex] : 'Tiempo Agotado',
            correctAnswer: this.activeQuestion.options[this.activeQuestion.answer],
            explanation: this.activeQuestion.explanation,
            isCorrect: isCorrect
        });

        explanationBox.innerText = `💡 Explicación: ${this.activeQuestion.explanation}`;
        explanationBox.classList.add('active');

        if (isCorrect) {
            soundEngine.playCorrect();
            const mult = this.avatars[this.selectedAvatar].scoreMult;
            this.score += 250 * this.combo * mult;
            this.combo = Math.min(5, this.combo + 1);
            
            // Retroceder al perseguidor
            this.chaser.distancePercent = Math.max(5, this.chaser.distancePercent - 15);
            
            // Conceder invencibilidad y escudo temporal
            this.player.invincibleTimer = 90;
            this.player.isShielded = true;

            setTimeout(() => {
                modal.classList.remove('active');
                this.state = 'PLAYING';
            }, 1200);
        } else {
            soundEngine.playWrong();
            this.lives--;
            this.combo = 1;
            
            // El perseguidor avanza peligrosamente
            this.chaser.distancePercent += 25;

            setTimeout(() => {
                modal.classList.remove('active');
                if (this.lives <= 0 || this.chaser.distancePercent >= 100) {
                    this.triggerGameOver('¡Te has quedado sin vidas!');
                } else {
                    this.player.invincibleTimer = 90;
                    this.state = 'PLAYING';
                }
            }, 2200);
        }
    }

    triggerGameOver(reasonText) {
        this.state = 'GAMEOVER';
        soundEngine.stopMusic();
        soundEngine.playGameOver();

        const currentSubjectScores = this.leaderboards[this.currentSubject] || [];
        const isHighScore = currentSubjectScores.length < 5 || this.score > currentSubjectScores[currentSubjectScores.length - 1].score;

        if (isHighScore && this.score > 0) {
            soundEngine.playHighScore();
            document.getElementById('highscore-subject').innerText = this.currentSubject.toUpperCase();
            document.getElementById('highscore-score-val').innerText = Math.floor(this.score);
            document.getElementById('highscore-modal').classList.add('active');
        } else {
            this.showGameOverSummary(reasonText);
        }
    }

    submitHighScore() {
        const input = document.getElementById('player-name-input');
        const name = input.value.trim() || 'Estudiante Anónimo';

        const newEntry = {
            name: name,
            score: Math.floor(this.score),
            date: new Date().toISOString().split('T')[0]
        };

        const list = this.leaderboards[this.currentSubject] || [];
        list.push(newEntry);
        list.sort((a, b) => b.score - a.score);
        this.leaderboards[this.currentSubject] = list.slice(0, 5); // Mantener solo el Top 5

        this.saveLeaderboards();
        document.getElementById('highscore-modal').classList.remove('active');
        this.showGameOverSummary('¡Nuevo Récord Registrado!');
    }

    showGameOverSummary(reasonText) {
        document.getElementById('gameover-reason').innerText = reasonText;
        document.getElementById('final-score-val').innerText = Math.floor(this.score);
        document.getElementById('final-distance-val').innerText = `${Math.floor(this.distance)}m`;
        document.getElementById('final-accuracy-val').innerText = `${this.calculateAccuracy()}%`;

        // Renderizar lista de revisión pedagógica
        const reviewList = document.getElementById('gameover-review-list');
        reviewList.innerHTML = '';

        if (this.answeredQuestions.length === 0) {
            reviewList.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:10px;">No respondiste preguntas en esta carrera.</div>';
        } else {
            this.answeredQuestions.forEach(item => {
                const div = document.createElement('div');
                div.className = `review-item ${item.isCorrect ? 'correct-item' : 'wrong-item'}`;
                div.innerHTML = `
                    <div class="review-q">${item.isCorrect ? '✅' : '❌'} ${item.question}</div>
                    <div class="review-ans">Tu respuesta: <b>${item.userAnswer}</b> | Correcta: <b>${item.correctAnswer}</b></div>
                    <div style="font-size:0.8rem; margin-top:4px; color:var(--text-muted);">${item.explanation}</div>
                `;
                reviewList.appendChild(div);
            });
        }

        this.showScreen('gameover-screen');
    }

    calculateAccuracy() {
        if (this.answeredQuestions.length === 0) return 100;
        const correctCount = this.answeredQuestions.filter(q => q.isCorrect).length;
        return Math.round((correctCount / this.answeredQuestions.length) * 100);
    }

    updateLeaderboardUI(subject) {
        const list = this.leaderboards[subject] || [];
        const tbody = document.getElementById('leaderboard-tbody');
        tbody.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const row = document.createElement('tr');
            if (i < list.length) {
                const item = list[i];
                let rankClass = i === 0 ? 'rank-1' : (i === 1 ? 'rank-2' : (i === 2 ? 'rank-3' : 'rank-other'));
                row.innerHTML = `
                    <td><span class="rank-badge ${rankClass}">${i + 1}</span></td>
                    <td>${item.name}</td>
                    <td style="color:#00f0ff; font-family:'Orbitron'; font-weight:700;">${item.score}</td>
                    <td style="color:var(--text-muted); font-size:0.85rem;">${item.date}</td>
                `;
            } else {
                row.innerHTML = `
                    <td><span class="rank-badge rank-other">${i + 1}</span></td>
                    <td style="color:var(--text-muted);">- Vacío -</td>
                    <td style="color:var(--text-muted);">0</td>
                    <td style="color:var(--text-muted);">-</td>
                `;
            }
            tbody.appendChild(row);
        }
    }

    renderLoop() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.drawBackground();
        
        if (this.state === 'PLAYING' || this.state === 'TRIVIA') {
            this.update();
            this.drawEntities();
        }

        requestAnimationFrame(() => this.renderLoop());
    }

    drawBackground() {
        // Fondo degradado futurista
        let grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#0c0824');
        grad.addColorStop(0.7, '#180e3d');
        grad.addColorStop(1, '#05030d');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Estrellas lejanas en movimiento
        this.ctx.fillStyle = '#ffffff';
        this.bgStars.forEach(star => {
            if (this.state === 'PLAYING') {
                star.x -= star.speed * (this.speed / 6);
                if (star.x < 0) star.x = this.width;
            }
            this.ctx.globalAlpha = Math.random() * 0.5 + 0.3;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        this.ctx.globalAlpha = 1.0;

        // Cuadrícula / Suelo Neón
        const groundY = this.height - 110;
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, groundY);
        this.ctx.lineTo(this.width, groundY);
        this.ctx.stroke();

        // Relleno de suelo
        let groundGrad = this.ctx.createLinearGradient(0, groundY, 0, this.height);
        groundGrad.addColorStop(0, 'rgba(0, 240, 255, 0.1)');
        groundGrad.addColorStop(1, '#05030d');
        this.ctx.fillStyle = groundGrad;
        this.ctx.fillRect(0, groundY, this.width, this.height - groundY);

        // Líneas de velocidad en el suelo
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
        const lineOffset = (this.distance * 10) % 60;
        for (let x = -lineOffset; x < this.width; x += 60) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, groundY);
            this.ctx.lineTo(x - 30, this.height);
            this.ctx.stroke();
        }
    }

    drawEntities() {
        const groundY = this.height - 110;

        // Dibujar Perseguidor ("La Sombra de la Ignorancia")
        const chaserX = (this.chaser.distancePercent / 100) * (this.player.x - 30);
        this.ctx.save();
        this.ctx.shadowBlur = 25;
        this.ctx.shadowColor = '#ff2a6d';
        this.ctx.fillStyle = 'rgba(255, 42, 109, 0.85)';
        
        // Forma de la sombra monstruo / dron
        this.ctx.beginPath();
        this.ctx.arc(chaserX, groundY - 70, 45, 0, Math.PI * 2);
        this.ctx.fill();

        // Ojos brillantes amenazantes
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(chaserX + 15, groundY - 80, 6, 0, Math.PI * 2);
        this.ctx.arc(chaserX + 15, groundY - 60, 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // Dibujar Obstáculos
        this.obstacles.forEach(obs => {
            this.ctx.save();
            if (obs.type === 'spike') {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#ffaa00';
                this.ctx.fillStyle = '#ffaa00';
                this.ctx.beginPath();
                this.ctx.moveTo(obs.x, obs.y + obs.height);
                this.ctx.lineTo(obs.x + obs.width / 2, obs.y);
                this.ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
                this.ctx.closePath();
                this.ctx.fill();
            } else if (obs.type === 'laser') {
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = '#ff2a6d';
                this.ctx.fillStyle = '#ff2a6d';
                this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            } else if (obs.type === 'drone') {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.fillStyle = '#00f0ff';
                this.ctx.beginPath();
                this.ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        });

        // Dibujar Collectibles (Orbes y Escudos)
        this.collectibles.forEach(col => {
            this.ctx.save();
            const pulseSize = col.size + Math.sin(col.pulse) * 3;
            if (col.type === 'orb') {
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = '#ffd700';
                this.ctx.fillStyle = '#ffd700';
                this.ctx.beginPath();
                this.ctx.arc(col.x, col.y, pulseSize, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (col.type === 'shield') {
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.fillStyle = '#00f0ff';
                this.ctx.beginPath();
                this.ctx.arc(col.x, col.y, pulseSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        });

        // Dibujar Partículas
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Dibujar Jugador / Avatar
        this.ctx.save();
        if (this.player.invincibleTimer > 0 && Math.floor(this.player.invincibleTimer / 4) % 2 === 0) {
            this.ctx.globalAlpha = 0.4;
        }

        const px = this.player.x;
        const py = this.player.y;
        const avatarInfo = this.avatars[this.selectedAvatar];

        // Aura de Escudo de Energía
        if (this.player.isShielded) {
            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = '#00f0ff';
            this.ctx.strokeStyle = '#00f0ff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(px + 22, py + 30, 42, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Cuerpo del Runner Neón
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.fillStyle = '#ffffff';

        // Cabeza / Casco
        this.ctx.beginPath();
        this.ctx.arc(px + 22, py + 15, 14, 0, Math.PI * 2);
        this.ctx.fill();

        // Emoji / Icono del Avatar en la cabeza
        this.ctx.font = '16px Outfit';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(avatarInfo.icon, px + 22, py + 20);

        // Tronco
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.fillRect(px + 12, py + 28, 20, 22);

        // Piernas corriendo
        const legAnim = Math.sin(this.distance * 0.8) * 12;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 4;
        
        // Pierna 1
        this.ctx.beginPath();
        this.ctx.moveTo(px + 16, py + 50);
        this.ctx.lineTo(px + 10 + legAnim, py + 60);
        this.ctx.stroke();

        // Pierna 2
        this.ctx.beginPath();
        this.ctx.moveTo(px + 28, py + 50);
        this.ctx.lineTo(px + 34 - legAnim, py + 60);
        this.ctx.stroke();

        this.ctx.restore();
    }
}

// Inicializar el Juego al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});

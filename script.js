(() => {
    /* ==========================================================================
       PART 1: THE STATE ENGINE
       ========================================================================== */
    const AppState = {
        currentLevel: 'kids',
        currentIndex: 0,
        score: 0,
        timer: null,
        timeLeft: 20,
        isLocked: false
    };

    /* ==========================================================================
       PART 2: DOM SELECTORS
       ========================================================================== */
    const DOM = {
        views: {
            welcome: document.getElementById('view-welcome'),
            assessment: document.getElementById('view-assessment'),
            analytics: document.getElementById('view-analytics')
        },
        display: {
            questionText: document.getElementById('question-text'),
            optionsContainer: document.getElementById('options-container'),
            timerDisplay: document.getElementById('timer-display')
        },
        controls: {
            levelKids: document.getElementById('btn-level-kids'),
            levelHS: document.getElementById('btn-level-hs'),
            levelAdv: document.getElementById('btn-level-adv'),
            restartBtn: document.getElementById('btn-restart')
        }
    };

    /* ==========================================================================
       PART 3: 3-TIER OBFUSCATED QUESTION BANK (BASE64)
       ========================================================================== */
    const questionBank = {
        kids: [
            { 
                id: "k1", 
                q: "What color is human blood inside your body?", 
                options: ["Red", "Blue", "Green", "Yellow"], 
                answerCode: "UmVk" 
            },
            { 
                id: "k2", 
                q: "Which organ do you use to think?", 
                options: ["Heart", "Stomach", "Brain", "Lungs"], 
                answerCode: "QnJhaW4=" 
            }
        ],
        highSchool: [
            { 
                id: "hs1", 
                q: "Which chamber of the heart pumps oxygenated blood to the body?", 
                options: ["Right Atrium", "Left Ventricle", "Right Ventricle", "Left Atrium"], 
                answerCode: "TGVmdCBWZW50cmljbGU=" 
            },
            { 
                id: "hs2", 
                q: "What is the longest bone in the human body?", 
                options: ["Tibia", "Humerus", "Femur", "Fibula"], 
                answerCode: "RmVtdXI=" 
            }
        ],
        advanced: [
            { 
                id: "adv1", 
                q: "Which neurotransmitter is primarily implicated in the reward pathway?", 
                options: ["Serotonin", "Dopamine", "GABA", "Acetylcholine"], 
                answerCode: "RG9wYW1pbmU=" 
            },
            { 
                id: "adv2", 
                q: "Where does the Krebs cycle occur in a eukaryotic cell?", 
                options: ["Cytoplasm", "Nucleus", "Mitochondrial Matrix", "Golgi Apparatus"], 
                answerCode: "TWl0b2Nob25kcmlhbCBNYXRyaXg=" 
            }
        ]
    };
    /* ==========================================================================
       PART 4: CORE UTILITIES
       ========================================================================== */
    function switchView(viewElement) {
        DOM.views.welcome.classList.add('hidden');
        DOM.views.assessment.classList.add('hidden');
        DOM.views.analytics.classList.add('hidden');
        viewElement.classList.remove('hidden');
    }

    // The Fisher-Yates Shuffler: Fixes the "Always click B" exploit
    function shuffleArray(array) {
        let shuffled = [...array]; 
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function startTimer() {
        AppState.timeLeft = 20;
        DOM.display.timerDisplay.innerText = AppState.timeLeft;
        AppState.timer = setInterval(() => {
            AppState.timeLeft--;
            DOM.display.timerDisplay.innerText = AppState.timeLeft;
            if (AppState.timeLeft <= 0) {
                clearInterval(AppState.timer);
                forceNextQuestion();
            }
        }, 1000);
    }

    /* ==========================================================================
       PART 5: RENDER ENGINE
       ========================================================================== */
    function renderQuestion() {
        AppState.isLocked = false;
        DOM.display.optionsContainer.innerHTML = '';
        
        // Pull from the correct array (Kids, HS, or Adv) based on what the user picked
        const currentActiveBank = questionBank[AppState.currentLevel];
        const currentQuestion = currentActiveBank[AppState.currentIndex];
        
        DOM.display.questionText.innerText = currentQuestion.q;
        
        // Shuffle the buttons before painting them to the screen
        const scrambledOptions = shuffleArray(currentQuestion.options);
        
        scrambledOptions.forEach(optionText => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.innerText = optionText;
            btn.addEventListener('click', () => handleSelection(btn, optionText, currentQuestion));
            DOM.display.optionsContainer.appendChild(btn);
        });
        
        startTimer();
    }
    /* ==========================================================================
       PART 6: VALIDATION & SCORING (CRYPTOGRAPHY)
       ========================================================================== */
    function handleSelection(btnElement, selectedText, questionObj) {
        if (AppState.isLocked) return;
        AppState.isLocked = true;
        clearInterval(AppState.timer);
        
        // Encrypt the user's click to check against the Base64 code
        const encodedSelection = btoa(selectedText);
        
        if (encodedSelection === questionObj.answerCode) {
            btnElement.classList.add('correct');
            AppState.score += 10;
        } else {
            btnElement.classList.add('wrong');
        }
        
        setTimeout(forceNextQuestion, 1500);
    }

    function forceNextQuestion() {
        const currentActiveBank = questionBank[AppState.currentLevel];
        AppState.currentIndex++;
        
        if (AppState.currentIndex < currentActiveBank.length) {
            renderQuestion();
        } else {
            endGame();
        }
    }

    function endGame() {
        switchView(DOM.views.analytics);
        document.getElementById('final-score').innerText = AppState.score;
    }

    /* ==========================================================================
       PART 7: INITIALIZATION & SECURITY CLEANUP
       ========================================================================== */
    function launchGame(levelString) {
        AppState.currentLevel = levelString;
        AppState.score = 0;
        AppState.currentIndex = 0;
        switchView(DOM.views.assessment);
        renderQuestion();
    }

    // Bind Level Buttons to launch the correct array
    DOM.controls.levelKids?.addEventListener('click', () => launchGame('kids'));
    DOM.controls.levelHS?.addEventListener('click', () => launchGame('highSchool'));
    DOM.controls.levelAdv?.addEventListener('click', () => launchGame('advanced'));
    
    // Bind Restart
    DOM.controls.restartBtn?.addEventListener('click', () => {
        switchView(DOM.views.welcome);
    });

    // Cleanup memory on page exit
    window.addEventListener('beforeunload', () => clearInterval(AppState.timer));

})(); // <--- THE VAULT DOOR SLAMS SHUT (END OF FILE)

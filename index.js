document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const fileInput = document.getElementById('file-input');
    const settingsPanel = document.getElementById('settings-panel');
    const changeBgBtn = document.getElementById('change-bg-btn');
    const resetBgBtn = document.getElementById('reset-bg-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    
    // Message settings inputs
    const xWinMessage = document.getElementById('x-win-message');
    const oWinMessage = document.getElementById('o-win-message');
    const drawMessage = document.getElementById('draw-message');
    
    // Font style settings - with error checking to prevent null references
    const popupFontFamily = document.getElementById('popup-font-family') || { value: 'sans-serif' };
    const popupFontSize = document.getElementById('popup-font-size') || { value: 'text-4xl' };
    const popupFontColor = document.getElementById('popup-font-color') || { value: 'text-white' };
    const popupFontStyle = document.getElementById('popup-font-style') || { value: '' };
    const popupFontWeight = document.getElementById('popup-font-weight') || { value: 'font-bold' };
    const popupTextEffect = document.getElementById('popup-text-effect') || { value: '' };
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    // Custom messages
    let customMessages = {
        xWin: "X Kazandı!",
        oWin: "O Kazandı!",
        draw: "Berabere"
    };
    
    // Add console log to check initialization
    console.log("Game initialized with custom messages:", customMessages);
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    function handleCellClick(e) {
        console.log("Cell clicked");
        const clickedCell = e.target.closest('.cell');
        if (!clickedCell) {
            console.log("No cell element found in click target");
            return;
        }
        
        const cellIndex = parseInt(clickedCell.getAttribute('data-index'));
        console.log(`Cell index: ${cellIndex}, Current player: ${currentPlayer}`);
        
        // If cell is already occupied
        if (gameState[cellIndex] !== '') {
            console.log(`Cell ${cellIndex} is already occupied with ${gameState[cellIndex]}`);
            // If the cell already has the current player's symbol, pass the turn and update borders
            if (gameState[cellIndex] === currentPlayer) {
                console.log("Cell already has current player's mark, passing turn");
                
                // Pass turn to next player
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                console.log(`Passed turn to player ${currentPlayer}`);
                
                // Update borders of all cells to match the new current player (just like clicking empty cell)
                updateBordersAfterMove();
                
                // Trigger screen pulse for the new player (optional)
                triggerScreenPulse(currentPlayer);
                
                return;
            }
            
            // Otherwise toggle to the current player's symbol
            const newMark = currentPlayer;
            gameState[cellIndex] = newMark;
            console.log(`Changed cell ${cellIndex} mark to ${newMark}`);
            
            // Clear cell content
            clickedCell.innerHTML = '';
            
            // Create symbol with animation
            const symbol = document.createElement('span');
            symbol.textContent = newMark;
            symbol.className = `inline-block font-bold ${newMark === 'X' ? 'text-neon-red' : 'text-neon-blue'} flip-animation`;
            clickedCell.appendChild(symbol);
            
            // Reset animation
            void symbol.offsetWidth; // Trigger reflow
            
            // Screen pulse effect based on player
            triggerScreenPulse(currentPlayer);
            
            // Update borders to match current player
            updateBordersAfterMove();
            
            // Check for win/draw
            console.log("Checking for win/draw");
            checkResult();
            
            // Only update current player if game is still active
            if (gameActive) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                console.log(`Switched to player ${currentPlayer}`);
            } else {
                console.log("Game is no longer active");
            }
            
            return;
        }
        
        if (!gameActive) {
            console.log("Game is not active, ignoring click");
            return;
        }
        
        // If the cell is empty, place the current player's mark
        gameState[cellIndex] = currentPlayer;
        console.log(`Placed ${currentPlayer} in cell ${cellIndex}`);
        
        // Create symbol with animation
        const symbol = document.createElement('span');
        symbol.textContent = currentPlayer;
        symbol.className = `inline-block font-bold ${currentPlayer === 'X' ? 'text-neon-red' : 'text-neon-blue'} flip-animation`;
        clickedCell.appendChild(symbol);
        
        // Screen pulse effect based on player
        triggerScreenPulse(currentPlayer);
        
        // Update borders to match the player who just moved
        updateBordersAfterMove();
        
        // Check for win/draw
        console.log("Checking for win/draw");
        checkResult();
        
        // Only update current player if game is still active
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            console.log(`Switched to player ${currentPlayer}`);
        } else {
            console.log("Game is no longer active");
        }
    }
    
    function triggerScreenPulse(player) {
        const overlay = document.getElementById('screen-overlay');
        
        // Remove any existing animation classes
        overlay.classList.remove('pulse-red', 'pulse-blue');
        
        // Force a reflow to restart the animation
        void overlay.offsetWidth;
        
        // Add appropriate pulse class based on player
        if (player === 'X') {
            overlay.classList.add('pulse-red');
        } else {
            overlay.classList.add('pulse-blue');
        }
        
        // Remove the class after animation completes
        setTimeout(() => {
            overlay.classList.remove('pulse-red', 'pulse-blue');
        }, 500);
    }
    
    function updateBordersAfterMove() {
        // Remove all border classes
        cells.forEach(cell => {
            cell.classList.remove('border-neon-red', 'border-neon-blue', 'border-neon-white');
        });
        
        // Add border class based on the current player
        const borderClass = currentPlayer === 'X' ? 'border-neon-red' : 'border-neon-blue';
        cells.forEach(cell => {
            cell.classList.add(borderClass);
        });
    }
    
    function checkResult() {
        console.log("Checking game result");
        console.log("Current game state:", gameState);
        
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const pos1 = gameState[a];
            const pos2 = gameState[b];
            const pos3 = gameState[c];
            
            console.log(`Checking condition [${a},${b},${c}] with values [${pos1},${pos2},${pos3}]`);
            
            if (pos1 === '' || pos2 === '' || pos3 === '') {
                continue;
            }
            
            if (pos1 === pos2 && pos2 === pos3) {
                roundWon = true;
                console.log(`Win detected at positions [${a},${b},${c}]`);
                break;
            }
        }
        
        if (roundWon) {
            // Show popup with customized message based on winner
            const winMessage = currentPlayer === 'X' ? customMessages.xWin : customMessages.oWin;
            console.log(`Win confirmed. Showing popup with message: ${winMessage}`);
            showPopup(winMessage);
            
            // Then trigger 5 consecutive pulses for the winner
            setTimeout(() => {
                triggerVictoryPulse(currentPlayer);
            }, 100);
            
            gameActive = false;
            setTimeout(restartGame, 5000);
            return;
        }
        
        // Check for draw - all cells filled
        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            // Show customized draw message
            console.log(`Draw detected. Showing popup with message: ${customMessages.draw}`);
            showPopup(customMessages.draw);
            
            // No victory pulse for a draw
            gameActive = false;
            setTimeout(restartGame, 5000);
            return;
        }
        
        console.log("Game continues");
    }
    
    function triggerVictoryPulse(player) {
        console.log("Triggering victory pulse for player:", player);
        
        // Make the overlay more visible for victory
        const overlay = document.getElementById('screen-overlay');
        overlay.style.opacity = "0"; // Reset
        
        // Trigger 5 consecutive pulses with the player's color
        const pulseDelay = 500; // 0.5 seconds per pulse
        const pulseClass = player === 'X' ? 'pulse-red' : 'pulse-blue';
        
        // Remove any existing classes
        overlay.className = 'screen-overlay';
        
        for(let i = 0; i < 5; i++) {
            setTimeout(() => {
                console.log(`Pulse ${i+1} for ${player}`);
                overlay.classList.remove(pulseClass);
                void overlay.offsetWidth; // Force reflow
                overlay.classList.add(pulseClass);
            }, i * pulseDelay);
        }
    }
    
    function showPopup(message) {
        console.log("Showing popup with message:", message);
        popupMessage.textContent = message;
        
        // Apply the selected font styles (with safety checks)
        if (popupFontFamily && typeof popupFontFamily.value !== 'undefined') {
            popupMessage.style.fontFamily = popupFontFamily.value;
        }
        if (popupFontStyle && typeof popupFontStyle.value !== 'undefined') {
            popupMessage.style.fontStyle = popupFontStyle.value;
        }
        if (popupTextEffect && typeof popupTextEffect.value !== 'undefined') {
            popupMessage.style.textTransform = popupTextEffect.value;
        }
        
        // Remove all existing size, weight, and color classes
        popupMessage.className = '';
        
        // Add the selected font size, weight, and color classes
        const fontSizeClass = popupFontSize && typeof popupFontSize.value !== 'undefined' ? popupFontSize.value : 'text-4xl';
        const fontColorClass = popupFontColor && typeof popupFontColor.value !== 'undefined' ? popupFontColor.value : 'text-white';
        const fontWeightClass = popupFontWeight && typeof popupFontWeight.value !== 'undefined' ? popupFontWeight.value : 'font-bold';
        
        popupMessage.classList.add(
            fontSizeClass, 
            fontColorClass,
            fontWeightClass,
            'bg-black', 
            'bg-opacity-80', 
            'p-8', 
            'rounded-lg', 
            'shadow-2xl', 
            'border-2', 
            'border-white', 
            'border-opacity-60'
        );
        
        // Add underline if selected
        if (popupTextEffect && popupTextEffect.value === 'underline') {
            popupMessage.classList.add('underline');
        }
        
        // Make popup visible
        popup.classList.add('opacity-100', 'visible');
        popup.classList.remove('opacity-0', 'invisible');
        
        console.log("Popup should be visible now");
        
        setTimeout(() => {
            popup.classList.remove('opacity-100', 'visible');
            popup.classList.add('opacity-0', 'invisible');
            console.log("Popup hidden after timeout");
        }, 4700); // Remove a bit earlier than restart for smooth transition
    }
    
    function restartGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('border-neon-red', 'border-neon-blue');
            cell.classList.add('border-neon-white');
        });
    }
    
    // Change "Ctrl" key press to open settings panel
    document.addEventListener('keydown', function(e) {
        // Check if "Ctrl" key was pressed (17 is the key code for Ctrl)
        if (e.keyCode === 17 || e.key === 'Control') {
            toggleSettingsPanel();
        }
    });
    
    // Toggle settings panel visibility
    function toggleSettingsPanel() {
        const isVisible = !settingsPanel.style.transform || 
                           settingsPanel.style.transform === 'translateX(100%)';
        
        if (isVisible) {
            // Open panel
            settingsPanel.style.transform = 'translateX(0)';
        } else {
            // Close panel
            settingsPanel.style.transform = 'translateX(100%)';
        }
    }
    
    // Settings panel event listeners
    closeSettingsBtn.addEventListener('click', () => {
        settingsPanel.style.transform = 'translateX(100%)';
    });
    
    changeBgBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    resetBgBtn.addEventListener('click', () => {
        document.body.style.backgroundImage = 'none';
        // Also reset the file input to ensure we can reselect the same file
        fileInput.value = '';
    });
    
    // Update custom messages on input change
    xWinMessage.addEventListener('input', function() {
        customMessages.xWin = this.value;
    });
    
    oWinMessage.addEventListener('input', function() {
        customMessages.oWin = this.value;
    });
    
    drawMessage.addEventListener('input', function() {
        customMessages.draw = this.value;
    });
    
    // Handle file selection for background
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Set the background image
                document.body.style.backgroundImage = `url('${e.target.result}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
            };
            
            reader.readAsDataURL(this.files[0]);
        }
        
        // Reset the file input value after each use
        // This allows the same file to be selected again
        this.value = '';
    });
    
    // Add event listeners to cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
});
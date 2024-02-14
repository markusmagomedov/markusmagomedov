let timerInterval;

// Start the main timer and disable the main start button
function startMainTimer() {
    const button = document.getElementById('mainStartButton');
    if (button.classList.contains('start')) {
        // Starting the timer
        button.classList.remove('start');
        button.classList.add('stop');
        button.textContent = 'Stop the Timer';

        const startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
            const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60).toString().padStart(2, '0');
            const seconds = Math.floor((elapsedTime / 1000) % 60).toString().padStart(2, '0');

            document.getElementById('timer').textContent = `Timer: ${hours}:${minutes}:${seconds}`;
        }, 1000);
    } else {
        // Stopping the timer
        clearInterval(timerInterval);
        button.classList.remove('stop');
        button.classList.add('start');
        button.textContent = 'Start Challenges';
    }
}

function startRoom(roomNumber) {
    document.getElementById(`startButtonForRoom${roomNumber}`).style.display = 'none';
    document.getElementById(`btn1ForRoom${roomNumber}`).disabled = false;
    document.getElementById(`flag1ForRoom${roomNumber}`).disabled = false;
}


function openRoomDetail(roomId) {
    // Create or reuse an overlay
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex'; // Ensure it's visible

    // Prevent the overlay from closing the room detail when clicked
    overlay.onclick = function(event) {
        // Check if the click is directly on the overlay, not its children
        if (event.target === this) {
            closeRoomDetail();
        }
    };
    

    const roomNumber = roomId.replace('room', ''); // Extract the room number
    const roomDetail = document.getElementById('roomDetail');
    
    // Dynamically generate the room's content
    roomDetail.innerHTML = `
        <h2>Room ${roomNumber} Challenges</h2>
        <button id="startButtonForRoom${roomNumber}" onclick="startRoom('${roomNumber}')">Start Room ${roomNumber}</button>
        ${generateRoomContent(roomNumber)}
    `;
    
    roomDetail.style.display = 'flex'; // Make sure the room detail is visible
    roomDetail.classList.remove('hidden'); // In case you're toggling visibility with a 'hidden' class

    // Stop propagation to prevent the overlay click from closing the detail view
    roomDetail.onclick = function(event) {
        event.stopPropagation();
    };
    
}

// Cookie management functions
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function generateRoomContent(roomNumber) {
    let content = '';
    for (let i = 1; i <= 5; i++) {
        // Construct the path to each challenge's HTML file based on the room number
        const challengePath = `../toad/tuba${roomNumber}/html/ctf${i}.html`;
        content += `
            <div class="challenge">
                <button id="btn${i}ForRoom${roomNumber}" onclick="window.open('${challengePath}', '_blank');" disabled>Open Challenge ${i}</button>
                <input type="text" id="flag${i}ForRoom${roomNumber}" placeholder="Enter Flag" oninput="checkFlag(${i}, this.value, 'correctFlag${i}', '${roomNumber}')" disabled>
            </div>
        `;
    }
    return content;
}


// Enable the first flag input for the given room
function enableFirstFlagInput(roomNumber) {
    document.getElementById(`flag1ForRoom${roomNumber}`).disabled = false;
}

// Check the entered flag against the correct one
function checkFlag(challengeNumber, enteredFlag, correctFlag, roomNumber) {
    if (enteredFlag === correctFlag) {
        alert("Correct flag!");
        setCookie(`challenge${challengeNumber}CompletedForRoom${roomNumber}`, 'true', 7);
        
        if (challengeNumber < 5) {
            const nextFlagInput = document.getElementById(`flag${challengeNumber + 1}ForRoom${roomNumber}`);
            const nextButton = document.getElementById(`btn${challengeNumber + 1}ForRoom${roomNumber}`);
            if (nextFlagInput && nextButton) {
                nextFlagInput.disabled = false;
                nextButton.disabled = false;
                setCookie(`challenge${challengeNumber + 1}AvailableForRoom${roomNumber}`, 'true', 7);
            }
        } else {
            document.querySelector(`.room-box[data-room-id='room${roomNumber}']`).classList.add('completed');
            setCookie(`room${roomNumber}Completed`, 'true', 7);
        }
    } else if (enteredFlag.length > 0) {
        console.log("Incorrect flag, try again.");
    }
}

function closeRoomDetail() {
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.style.display = 'none'; // Hide the overlay
    }
    const roomDetail = document.getElementById('roomDetail');
    roomDetail.style.display = 'none'; // Hide the room details
    roomDetail.classList.add('hidden'); // Optionally toggle visibility with a 'hidden' class
}

document.addEventListener('DOMContentLoaded', function() {
    const mainStartButton = document.getElementById('mainStartButton');
    mainStartButton.classList.add('start'); // Initialize as "Start" button
    for (let roomNumber = 1; roomNumber <= 2; roomNumber++) {
        for (let i = 1; i <= 5; i++) {
            const challengeCompleted = getCookie(`challenge${i}CompletedForRoom${roomNumber}`) === 'true';
            const nextFlagInput = document.getElementById(`flag${i + 1}ForRoom${roomNumber}`);
            const nextButton = document.getElementById(`btn${i + 1}ForRoom${roomNumber}`);
            
            if (challengeCompleted && nextFlagInput && nextButton) {
                nextFlagInput.disabled = false;
                nextButton.disabled = false;
            }

            if (challengeCompleted && i === 5) {
                document.querySelector(`.room-box[data-room-id='room${roomNumber}']`).classList.add('completed');
            }
        }
        
        if (getCookie(`room${roomNumber}Completed`) === 'true') {
            document.querySelector(`.room-box[data-room-id='room${roomNumber}']`).classList.add('completed');
        }
    }
});



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lottery Prediction</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Lottery Hack</h1>
        </header>
        <div class="game-info">
            <div id="issueNumber" class="issue-number">Period: 2024112800582</div>
            <div id="timeRemaining" class="timer">00:15</div>
            <button id="refreshButton">Refresh</button>
        </div>
        <div class="buttons">
            <button id="bigButton" class="big">Big</button>
            <button id="smallButton" class="small">Small</button>
        </div>
        <div id="predictedNumber" class="prediction">Bet on<br><br>Waiting...</div>
        <div id="loading" class="loading" style="display: none;">Loading...</div>
        <table>
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Big/Small</th>
                    <th>Color</th>
                    <th>Win/Lose</th>
                </tr>
            </thead>
            <tbody>
                <!-- Rows will be dynamically added here -->
            </tbody>
        </table>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

#### 2. `styles.css`

Copy the CSS styles into the `styles.css` file.

```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

header {
    text-align: center;
    margin-bottom: 20px;
}

.game-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.issue-number, .timer {
    font-size: 18px;
    font-weight: bold;
}

.buttons {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.big, .small {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.big {
    background-color: #4CAF50;
    color: white;
}

.small {
    background-color: #f44336;
    color: white;
}

.prediction {
    text-align: center;
    font-size: 20px;
    margin-bottom: 20px;
}

.loading {
    text-align: center;
    font-size: 16px;
    color: grey;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}
```

#### 3. `script.js`

Copy the JavaScript logic into the `script.js` file.

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const predictedNumberElement = document.getElementById('predictedNumber');
    const timerElement = document.getElementById('timeRemaining');
    const issueNumberElement = document.getElementById('issueNumber');
    const refreshButton = document.getElementById('refreshButton');
    const loadingElement = document.getElementById('loading');

    let currentIssueNumber = null;
    let timerInterval = null;

    const fetchGameIssue = () => {
        const requestData = {
            typeId: 1,
            language: 0,
            random: "e7fe6c090da2495ab8290dac551ef1ed",
            signature: "1F390E2B2D8A55D693E57FD905AE73A7",
            timestamp: 1723726679
        };

        return fetch('https://api.bdg88zf.com/api/webapi/GetGameIssue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json, text/plain, */*'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .catch(error => console.error('Error fetching game issue:', error));
    };

    const predictNextNumber = () => {
        return Math.random() < 0.5 ? 'Small' : 'Big';
    };

    const updatePrediction = (newIssueNumber) => {
        if (currentIssueNumber !== newIssueNumber) {
            currentIssueNumber = newIssueNumber;
            issueNumberElement.textContent = `Period: ${currentIssueNumber}`;

            loadingElement.style.display = 'block';

            setTimeout(() => {
                const prediction = predictNextNumber();
                predictedNumberElement.textContent = `Bet on\n\n${prediction}`;

                loadingElement.style.display = 'none';

                const lastPrediction = {
                    issueNumber: currentIssueNumber,
                    category: prediction
                };
                localStorage.setItem('lastPrediction', JSON.stringify(lastPrediction));
            }, 2000);
        }
    };

    const updateTimer = () => {
        fetchGameIssue()
        .then(data => {
            if (!data.data) {
                console.error('No data received for game issue.');
                return;
            }

            const { endTime, intervalM, issueNumber } = data.data;
            if (!endTime || !intervalM) {
                console.error('Incomplete data received for game issue.');
                return;
            }

            const endDate = new Date(endTime);
            const now = new Date();
            const remainingTimeMs = endDate - now;

            if (remainingTimeMs <= 0) {
                timerElement.textContent = "00:00";
                clearInterval(timerInterval);

                setTimeout(() => {
                    fetchGameIssue().then(data => {
                        if (!data.data) {
                            console.error('No data received for new game issue.');
                            return;
                        }

                        const newIssueNumber = data.data.issueNumber;
                        updatePrediction(newIssueNumber); 
                    });
                    timerInterval = setInterval(updateTimer, 1000);
                }, 3000);

            } else {
                const minutes = String(Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                const seconds = String(Math.floor((remainingTimeMs % (1000 * 60)) / 1000)).padStart(2, '0');
                timerElement.textContent = `${minutes}:${seconds}`;
            }

            if (currentIssueNumber !== issueNumber) {
                updatePrediction(issueNumber); 
            }
        })
        .catch(error => console.error('Error fetching game issue:', error));
    };

    fetchGameIssue().then(data => {
        if (!data.data) {
            console.error('No data received for initial game issue.');
            return;
        }

        const initialIssueNumber = data.data.issueNumber;
        const storedPrediction = localStorage.getItem('lastPrediction');
        const lastPrediction = storedPrediction ? JSON.parse(storedPrediction) : {};

        if (lastPrediction.issueNumber === initialIssueNumber) {
            predictedNumberElement.textContent = `Bet on\n\n${lastPrediction.category}`;
        } else {
            updatePrediction(initialIssueNumber);
        }
    });

    timerInterval = setInterval(updateTimer, 1000);

    refreshButton.addEventListener('click', () => {
        fetchGameIssue().then(data => {
            if (!data.data) {
                console.error('No data received for new game issue.');
                return;
            }

            const newIssueNumber = data.data.issueNumber;
            updatePrediction(newIssueNumber);
        });
    });
});
```

### Step 3: Run Your Project

1. **Open in Browser:**
   - Open the `index.html` file in a web browser to view and interact with your project.

2. **Local Server (Optional):**
   - For a more robust setup, consider using a local server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VSCode or using Node.js with a simple server setup.

This setup will allow you to see the interface and interact with the prediction and timing features as coded.
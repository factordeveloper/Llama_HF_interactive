const recordBtn = document.getElementById('record-btn');
const responseContainer = document.getElementById('response-container');
const body = document.body; // Referencia al elemento <body>

// SpeechRecognition para convertir voz a texto
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;
recognition.lang = 'en-US';

let isRecording = false;

recordBtn.addEventListener('mousedown', () => {
    body.classList.add('recording'); // Cambia el fondo a rojo y muestra el GIF
    responseContainer.innerHTML = 'Recording...';
    recognition.start();
    isRecording = true;
});

recordBtn.addEventListener('mouseup', () => {
    if (isRecording) {
        recognition.stop();
        isRecording = false;
        body.classList.remove('recording'); // Vuelve el fondo al color original y oculta el GIF
    }
});

// Cuando se reconoce la voz
recognition.addEventListener('result', async (event) => {
    const transcript = event.results[0][0].transcript;
    responseContainer.innerHTML = `<strong>Recorded:</strong> ${transcript}`;
    
    // Realiza la solicitud a la API con el texto transcrito
    try {
        responseContainer.innerHTML = 'Loading...';
        const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',  // Reemplaza con tu token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/Llama-3.2-3B-Instruct',
                messages: [{role: 'user', content: transcript}],
                max_tokens: 500,
                stream: false
            })
        });

        const data = await response.json();
        const botResponse = data.choices[0].message.content;
        responseContainer.innerHTML = `<strong>Response:</strong> ${botResponse}`;

        // Convertir el texto de respuesta en voz
        const utterance = new SpeechSynthesisUtterance(botResponse);
        window.speechSynthesis.speak(utterance);

    } catch (error) {
        responseContainer.innerHTML = 'An error occurred. Please try again later.';
    }
});


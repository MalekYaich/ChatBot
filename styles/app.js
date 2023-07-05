class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };

        this.state = false;
        this.messages = [];
        this.microphonePermission = sessionStorage.getItem('microphonePermission') === 'granted';
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });

        const recordButton = chatBox.querySelector('.record__button');

        recordButton.addEventListener('click', () => {
            if (this.recording) {
                this.stopRecording();
            } else {
                this.startRecording(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    startRecording(chatbox) {
        const recordButton = this.args.chatBox.querySelector('.record__button');
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                this.recording = true;
                const mediaRecorder = new MediaRecorder(stream);
                const chunks = [];

                recordButton.textContent = " ";
                recordButton.classList.add('recording'); // Ajout de la classe recording

                mediaRecorder.start();

                mediaRecorder.addEventListener('dataavailable', (event) => {
                    chunks.push(event.data);
                });
                mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    const audioURL = URL.createObjectURL(audioBlob);

                    const audioElement = document.createElement('audio');
                    audioElement.src = audioURL;
                    audioElement.controls = true;
                    

                    const msg = { name: 'User', message: audioElement.outerHTML };
                    this.messages.push(msg);
                    this.updateChatText(chatbox);

                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'recording.webm');
                    fetch('http://127.0.0.1:5000/predict-audio', {
                        method: 'POST',
                        body: formData,
                        mode: 'cors',
                    })
                        .then(response => response.json())
                        .then(data => {
                            const replyMsg = { name: 'Sam', message: data.answer };
                            this.messages.push(replyMsg);
                            this.updateChatText(chatbox);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        })
                        .finally(() => {
                            recordButton.classList.remove('recording'); // Suppression de la classe recording
                        });
                });

                recordButton.removeEventListener('click', this.startRecording);
                recordButton.addEventListener('click', () => {
                    mediaRecorder.stop();
                //    recordButton.textContent = 'Enregistrer';
                    this.recording = false;
                });
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
            });
    }

    stopRecording() {
        const recordButton = this.args.chatBox.querySelector('.record__button');
        recordButton.textContent = 'Enregistrer';
        this.recording = false;
        recordButton.classList.remove('recording'); // Suppression de la classe recording
    }


    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        let msg1;
        if (text1 instanceof Blob) {
            // Voice message
            const audioURL = URL.createObjectURL(text1);
            const audioElement = document.createElement('audio');
            audioElement.src = audioURL;
            audioElement.controls = true;

            msg1 = { name: "User", message: audioElement.outerHTML };
        } else {
            // Text message
            msg1 = { name: "User", message: text1 };
        }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "Sam", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox);
                textField.value = '';
            })
            .catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox);
                textField.value = '';
            });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();


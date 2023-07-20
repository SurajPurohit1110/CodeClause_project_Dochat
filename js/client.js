const socket = io('http://127.0.0.1:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const peoplesContainer = document.querySelector(".peoples");
const users_count = document.querySelector(".users-count");

// Audio that will play to give notification of new messages
var audio = new Audio('notification.mp3')

// Function to append messages sent or recive in the text box container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    const timeElement = document.createElement('div');
    let now = new Date();

    let time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeElement.innerHTML = time;
    timeElement.classList.add('time');

    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    if (position == 'left'){
        messageElement.append(timeElement);
    }
    else if(position == 'right'){
        messageElement.append(timeElement);
    }
    messageContainer.append(messageElement);

    // To get message notification
    if (position == 'left') {
        audio.play();
    }
}

// To ask new user's name and let the server know
const name = prompt("Enter your name")
socket.emit('new-user-joined', name);

// Listen when submit event fire 
form.addEventListener('submit', (e) => {
    e.preventDefault(); // page will not reload when submit event fire
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

// To send user joined the chat message to others from server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center');
});

// To recieve message from server
socket.on('recieve', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// To send user left the chat message to all the active users from server
socket.on('left', name => {
    append(`${name} left the chat`, 'center');
});

// To show all the available users in the chat
socket.on('user-list', users => {
    peoplesContainer.innerHTML="";
    users_arr = Object.values(users);
    for(i=0; i< users_arr.length; i++){
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        peoplesContainer.appendChild(p);
    }
    // To show number of users available
    users_count.innerHTML = users_arr.length;
});

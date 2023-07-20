const socket = io('http://127.0.0.1:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const peoplesContainer = document.querySelector(".peoples");
const users_count = document.querySelector(".users-count");
var audio = new Audio('notification.mp3')

const name = prompt("Enter your name")
console.log(name);
socket.emit('new-user-joined', name);

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


    if (position == 'left') {
        audio.play();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center');
});

socket.on('recieve', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'center');
});

socket.on('user-list', users => {
    peoplesContainer.innerHTML="";
    users_arr = Object.values(users);
    for(i=0; i< users_arr.length; i++){
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        peoplesContainer.appendChild(p);
    }
    users_count.innerHTML = users_arr.length;
});
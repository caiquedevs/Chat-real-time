const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

// emit => Emitir alguma informação
// on => Escutando alguma informação

const usernameDiv = document.getElementById('username');
usernameDiv.innerHTML = `Olá ${username} - Você está na sala <strong>${room}</strong>`;

socket.emit('select_room', { username, room }, (messages) => {
  messages.forEach((message) => createMessageDiv(message));
});

// Dispara mensagem nova pro socket
document.getElementById('message_input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const message = event.target.value;
    event.target.value = '';

    const data = {
      room,
      username,
      message,
    };

    socket.emit('message', data);
  }
});

// Ouve mensagem nova para criar na tela
socket.on('message', (data) => {
  createMessageDiv(data);
});

function createMessageDiv(data) {
  const messageDiv = document.getElementById('messages');

  messageDiv.innerHTML += `
    <div class="new_message">
      <label class="form-label">
        <strong>${data.username}</strong> <span> ${data.text} - ${dayjs(data.created_at).format(
    'DD/MM HH:mm'
  )}</span>
      </label>
    </div>
  `;
}

document.getElementById('logout').addEventListener('click', (event) => {
  window.location.href = 'index.html';
});

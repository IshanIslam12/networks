const params = new URLSearchParams(window.location.search);
const name = params.get('name');
const room = params.get('room');
document.getElementById("roomName").textContent = `Chat Room: ${room}`;
const ws = new WebSocket(`wss://chat-worker.your-subdomain.workers.dev/room/${room}?name=${name}`);

const messagesDiv = document.getElementById("messages");

ws.onmessage = event => {
  const msg = JSON.parse(event.data);
  const div = document.createElement("div");
  div.innerHTML = `<strong>${msg.name}</strong>: ${msg.text} <span style="float:right;">${msg.time}</span>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

document.getElementById("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("messageInput");
  if (input.value.trim()) {
    ws.send(JSON.stringify({ text: input.value }));
    input.value = '';
  }
});

function sendMessage() {
    const input = document.getElementById('message');
    const chat = document.getElementById('chat');
    
    if (input.value.trim() === '') return;
    
    const message = document.createElement('div');
    message.textContent = input.value;
    message.style.margin = '8px 0';
    message.style.padding = '8px 12px';
    message.style.background = '#1877f2';
    message.style.color = 'white';
    message.style.borderRadius = '12px';
    message.style.display = 'inline-block';
    
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
    
    input.value = '';
}

const chatList = document.getElementById("chatList");
const chatArea = document.getElementById("chat");
const messageInput = document.getElementById("message");
const chatTitle = document.getElementById("chatTitle");
const chatSubtitle = document.getElementById("chatSubtitle");
const messageForm = document.getElementById("messageForm");

let chats = [];
let activeChatId = null;

// Сохранение чатов в браузере
function saveChats() {
    localStorage.setItem("meetwe_chats", JSON.stringify(chats));
}

// Загрузка чатов
function loadChats() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("meetwe_chats") || "[]"
        );

        chats = Array.isArray(saved)
            ? saved.filter(chat =>
                chat &&
                typeof chat.id === "string" &&
                typeof chat.name === "string" &&
                Array.isArray(chat.messages)
            )
            : [];
    } catch {
        chats = [];
    }

    renderChatList();

    if (chats.length > 0) {
        openChat(chats[0].id);
    } else {
        showWelcome();
    }
}

// Приветственный экран
function showWelcome() {
    activeChatId = null;

    chatTitle.textContent = "Добро пожаловать!";
    chatSubtitle.textContent = "Создай новый чат или группу";

    chatArea.innerHTML =
        '<p class="empty">Твои разговоры появятся здесь 💬</p>';

    renderChatList();
}

// Создание личного чата
function createChat() {
    const name = prompt("Введи имя собеседника:");

    if (!name || !name.trim()) return;

    addChat(name.trim(), false, []);
}

// Создание группы
function createGroup() {
    const name = prompt("Введи название группы:");

    if (!name || !name.trim()) return;

    const members = prompt(
        "Введи имена участников через запятую:"
    );

    if (members === null) return;

    const groupMembers = members
        .split(",")
        .map(member => member.trim())
        .filter(Boolean);

    addChat(name.trim(), true, groupMembers);
}

// Добавление нового чата
function addChat(name, isGroup, members) {
    const chat = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        name: name,
        isGroup: isGroup,
        members: members,
        messages: []
    };

    chats.unshift(chat);

    saveChats();
    renderChatList();
    openChat(chat.id);
}

// Отображение списка чатов
function renderChatList() {
    chatList.innerHTML = "";

    chats.forEach(chat => {
        const item = document.createElement("div");

        item.className = "chat-item";

        if (chat.id === activeChatId) {
            item.classList.add("active");
        }

        const title = document.createElement("strong");
        title.textContent =
            (chat.isGroup ? "👥 " : "💬 ") + chat.name;

        const preview = document.createElement("small");

        if (chat.messages.length > 0) {
            preview.textContent =
                chat.messages[chat.messages.length - 1].text;
        } else if (chat.isGroup) {
            preview.textContent =
                "Участников: " + chat.members.length;
        } else {
            preview.textContent = "Нет сообщений";
        }

        item.appendChild(title);
        item.appendChild(preview);

        item.addEventListener("click", () => {
            openChat(chat.id);
        });

        chatList.appendChild(item);
    });
}

// Открытие чата
function openChat(id) {
    const chat = chats.find(item => item.id === id);

    if (!chat) return;

    activeChatId = id;

    chatTitle.textContent =
        (chat.isGroup ? "👥 " : "💬 ") + chat.name;

    chatSubtitle.textContent = chat.isGroup
        ? "Участников: " + chat.members.length
        : "Личный чат";

    renderMessages();
    renderChatList();

    messageInput.focus();
}

// Отображение сообщений
function renderMessages() {
    const chat = chats.find(item => item.id === activeChatId);

    chatArea.innerHTML = "";

    if (!chat) {
        showWelcome();
        return;
    }

    if (chat.messages.length === 0) {
        chatArea.innerHTML =
            '<p class="empty">Пока нет сообщений. Напиши первым! 👋</p>';

        return;
    }

    chat.messages.forEach(message => {
        const bubble = document.createElement("div");
        bubble.className = "message";

        const text = document.createElement("div");
        text.textContent = message.text;

        const time = document.createElement("small");
        time.className = "message-time";
        time.textContent = message.time;

        bubble.appendChild(text);
        bubble.appendChild(time);

        chatArea.appendChild(bubble);
    });

    chatArea.scrollTop = chatArea.scrollHeight;
}

// Отправка сообщения
function sendMessage() {
    const text = messageInput.value.trim();

    if (!text || !activeChatId) return;

    const chat = chats.find(item => item.id === activeChatId);

    if (!chat) return;

    const now = new Date();

    chat.messages.push({
        text: text,
        time: now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit"
        })
    });

    messageInput.value = "";

    saveChats();
    renderMessages();
    renderChatList();
}

// Отправка сообщения кнопкой Enter
messageForm.addEventListener("submit", function(event) {
    event.preventDefault();
    sendMessage();
});

// Запуск приложения
loadChats();

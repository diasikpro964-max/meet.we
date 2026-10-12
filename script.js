const chatList = document.getElementById("chatList");
const chatArea = document.getElementById("chat");
const messageInput = document.getElementById("message");
const chatTitle = document.getElementById("chatTitle");
const chatSubtitle = document.getElementById("chatSubtitle");
const messageForm = document.getElementById("messageForm");

let chats = [];
let activeChatId = null;

function saveChats() {
    localStorage.setItem("meetwe_chats", JSON.stringify(chats));
}

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

function showWelcome() {
    activeChatId = null;
    chatTitle.textContent = "Добро пожаловать!";
    chatSubtitle.textContent = "Создай новый чат или группу";
    chatArea.innerHTML =
        '<p class="empty">Твои разговоры появятся здесь 💬</p>';
    renderChatList();
}

function createChat() {
    const name = prompt("Как назвать новый чат?");

    if (!name || !name.trim())

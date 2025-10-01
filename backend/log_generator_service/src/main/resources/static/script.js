const socket = new SockJS("http://localhost:8080/logs");
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    console.log("Connected"); // проверка подключения
    stompClient.subscribe("/topic/logs", (message) => {
        console.log("Message received:", message.body); // проверяем в консоли
        const log = JSON.parse(message.body);
        const container = document.getElementById("logs");
        const item = document.createElement("div");
        item.innerText = `[${log.time}] ${log.level}: ${log.message}`;
        container.appendChild(item);
    });

    // вызываем сервер
    stompClient.send("/app/glog", {}, {});
});

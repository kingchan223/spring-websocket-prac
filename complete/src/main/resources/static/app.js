let stompClient = null;
let username = null;
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

//connect(): socket를 할당하고 해당 페이지의 sub을 선언하고 메세지가 들어올 경우 showGreeting을 통해 메세지를 화면에 띄우는 역할을 담당합니다.
function connect() {
    let socket = new SockJS('/gs-guide-websocket');//대부분의 브라우저가 웹소켓을 지원하지만 오래된 버전의 브라우저의 경우 아직 웹소켓을 지원하지 않음으로 Long Polling 방식을 지원해야 하는데 이를 위해 SockJS 같은 라이브러리가 존재
    // "/gs-guide-websocket", which is where our SockJS server waits for connections.
    stompClient = Stomp.over(socket);
    console.log(1, stompClient);
    stompClient.connect({}, function (frame) {//frame에는 연결정보 들어있음
        setConnected(true);
        console.log('Connected: ' + frame);
        // Upon a successful connection, the client subscribes to the "/topic/greetings" destination, where the server will publish greeting messages.
        stompClient.subscribe('/topic/greetings', function (gre) {//즉 사용자가 '/topic/greetings'를 구독하게 된다.
            showGreeting(JSON.parse(gre.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    $("#name-space").show();
    console.log("Disconnected");
}
//추가//
function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'content': $("#content").val(), 'username':username}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}
function setUsername(){
    username = $("#username").val();
    $("#message-space").append("<div>" +"your name:"+ username + "</div>");
    $("#name-space").hide();
}
$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
    $( "#set-username" ).click(function() { setUsername(); });
});


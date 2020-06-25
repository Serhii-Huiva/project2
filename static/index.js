document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener("unload", function() {
        localStorage.setItem('windowClose', 'true');
    });

    if (window.location.pathname == '/') {
        if (localStorage.getItem('windowClose') == 'true') {
            if (localStorage.getItem('username') != 'null') {
                localStorage.setItem('windowClose', 'false');
                const request = new XMLHttpRequest();
                const name = localStorage.getItem('username');
                request.open('POST', '/log');

                request.onload = () => {
                    const data = JSON.parse(request.responseText);

                    if (data.success) {
                        let href = location.protocol + '//' + document.domain + ':' + location.port + '/' + localStorage.getItem('activeTopic');
                        window.location = href;
                    }
                    else {
                        
                    }
                }
                const data = new FormData();
                data.append('name', name);
                data.append('login', 1);

                request.send(data);
            }
        }
    }

    document.querySelector('#exitButton').onclick = () => {
        const request = new XMLHttpRequest();
        const name = localStorage.getItem('username');
        request.open('POST', '/log');

        request.onload = () => {

            const data = JSON.parse(request.responseText);

            if (data.success){
                localStorage.setItem('username', null);
                alert(`Goodbye, ${name}!`);
                localStorage.setItem('activeTopic', '');
                localStorage.setItem('topics', JSON.stringify([]));
                window.location.href = 'http://127.0.0.1:5000/';
            }
            else {
                alert('Something went wrong!');
            }
        };

        const data = new FormData();
        data.append('name', name);
        data.append('login', 0);

        request.send(data);
        return false
    };

    document.querySelector('#enterName').disabled = true;

    document.querySelector('#loginForm').onkeyup = () => {
        if (document.querySelector('#username').value.length > 2)
            document.querySelector('#enterName').disabled = false;
        else
            document.querySelector('#enterName').disabled = true;
    };

    document.querySelector('#loginForm').onsubmit = () => {

        const request = new XMLHttpRequest();
        const name = document.querySelector('#username').value;
        request.open('POST', '/log');

        request.onload = () => {

            const data = JSON.parse(request.responseText);

            if (data.success) {
                localStorage.setItem('username', name);
                alert(`Wellcome, ${name}!`);
                location.reload();
            }
            else {
                const message = data.message;
                alert(message);
            }
        };

        const data = new FormData();
        data.append('name', name);
        data.append('login', 1);

        request.send(data);
        return false;
    };

    document.querySelector('#newTopicButton').disabled = true;

    document.querySelector('#formNewTopic').onkeyup = () => {
        if (document.querySelector('#inputNewTopic').value.length > 2)
            document.querySelector('#newTopicButton').disabled = false;
        else
            document.querySelector('#newTopicButton').disabled = true;
    };

    document.querySelector('#formNewTopic').onsubmit = () => {

        const request = new XMLHttpRequest();
        const topic = document.querySelector('#inputNewTopic').value;
        request.open('POST', '/topic');

        request.onload = () => {
            const data = JSON.parse(request.responseText);

            if (data.success) {
                document.querySelector('#inputNewTopic').value = '';
                document.querySelector('#newTopicButton').disabled = true;
                location.reload();
            }
            else {
                alert(data.message);
            }
        };

        const data = new FormData();
        data.append('topic', topic);
        data.append('add', 1);

        request.send(data);
        return false;
    };

    document.querySelectorAll('#topicClose').forEach( button => {

        if (localStorage.getItem('username') != "null") {

            button.style.display = "inline";

            button.onclick = () => {
                const request = new XMLHttpRequest();
                const topic = button.name;
                request.open('POST', '/topic');

                request.onload = () => {
                    const data = JSON.parse(request.responseText);

                    if (data.success) {
                        button.parentElement.style.animationPlayState = 'running';
                        button.parentElement.addEventListener('animationend', () =>  {
                            button.parentElement.remove();
                        });
                    }
                }

                const data = new FormData();
                data.append('topic', topic);
                data.append('add', 0);

                request.send(data);
                return false;
            }
        }
        else {
            button.style.display = "none";
        }
    });

    // socketIO
    if (window.location.pathname.slice(1) != '') {
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

        socket.on('connect', () => {

            // send message

            document.querySelector('#messageForm').onsubmit = () => {
                const topic = localStorage.getItem('activeTopic');
                const user = document.querySelector('#userName').innerHTML;
                const message = document.querySelector('#inputMessage').value;
                socket.emit('submit message', {'topic': topic, 
                                                'user': user, 
                                                'message': message});

                document.querySelector('#inputMessage').value = "";

                return false;
            };

            // delete message

            document.querySelectorAll('.deleteMessage').forEach( button => {
                button.onclick = () => {
                    const div = button.parentElement;
                    const messages = document.querySelector('.messanger_window').children;
                    const topic = localStorage.getItem('activeTopic');
                    let index;
        
                    for (index = 0; index < messages.length; index++) {
                        if (messages[index] == div) {
                            break;
                        }
                    }
                    socket.emit('delete message', { 'topic': topic,
                                                'index': index });
                }
            });
        });

        socket.on('delete message response', data => {
            const topic = data.topic;
            const index = data.index;

            if (window.location.pathname.slice(1) == topic) {
                const messages = document.querySelector('.messanger_window');
                const div = messages.children[index];

                div.innerHTML = '<h6>Message deleted by user.</h6>';

                setTimeout( () => {messages.removeChild(div);}, 5000);                
            }
        });

        socket.on('message response', data => {
            const topic = data.topic;
            var user = data.user;
            const message = data.message;
            const date = data.date;
            const time = data.time;
            const overflow = data.overflow;

            if (window.location.pathname.slice(1) == topic) {
                let div = document.createElement('div');
                let userName = document.createElement('h5');
                let messag = document.createElement('p');
                let dateTime = document.createElement('p');

                div.className = 'message';
                userName.className = 'userInMessage';
                messag.className = 'userMessage';
                dateTime.className = 'timeMessage';

                userName.innerHTML = user;
                messag.innerHTML = message;
                dateTime.innerHTML = date[0] + '.' + date[1] + '.' + date[2] + ' ' + time[0] + ':' + time[1] + ':' + time[2];

                switch (document.querySelector('#select').value) {
                    case 'Light':
                        myColor = 'lightblue';
                        alienColor = 'rgb(247, 255, 234)';
                        buttonColor = 'rgb(98, 173, 145)';
                        textColor = '#000';
                        break;
                    case 'Dark':
                        myColor = 'rgb(78, 24, 109)';
                        alienColor = 'rgb(100, 100, 100)';
                        buttonColor = 'rgb(110, 40, 105)';
                        textColor = '#fff';
                        break;
                    case 'Ukraine':
                        myColor = '#22aaaa';
                        alienColor = '#ffffaa';
                        buttonColor = 'rgb(136, 151, 201)';
                        textColor = '#000';
                        break;
                    case 'American':
                        myColor = 'steelblue';
                        alienColor = 'rgb(255, 200, 200)';
                        buttonColor = 'rgb(110, 156, 253)';
                        textColor = 'rgb(40, 40, 40)';
                        break;
                };

                if (user == localStorage.getItem('username')) {
                    div.classList.add('myMessage');
                    div.style.backgroundColor = myColor;

                    let button = document.createElement('button');
                    button.className = 'deleteMessage';
                    button.innerHTML = 'Delete message';
                    button.style.backgroundColor = buttonColor;
                    button.style.color = textColor;
            
                    div.prepend(button);
                }
                else {
                    div.classList.add('alienMessage');
                    div.style.backgroundColor = alienColor;
                };

                div.appendChild(userName);
                div.appendChild(messag);
                div.appendChild(dateTime);
                    
                document.querySelector('.messanger_window').append(div);
                    
                if (overflow) {
                    let element = document.querySelector('.message');
                    document.querySelector('.messanger_window').removeChild(element);
                }

                document.querySelector('.messanger_window').scrollTop = document.querySelector('.messanger_window').scrollHeight;
            }
        });
    }
});
let theme = document.querySelector('#select');
let themeName = theme.value;
let activeTheme = localStorage.getItem('theme');

if (activeTheme != null) {
    theme.value = activeTheme;
    SETColorTheme(activeTheme);
}
else {
    SETColorTheme(theme);
}

theme.addEventListener('change', () => {
    console.log('work');
    themeName = theme.value;
    if (themeName != localStorage.getItem('theme')) {
        localStorage.setItem('theme', themeName);
        SETColorTheme(themeName);
    }
});

function SETColorTheme (name) {
    let mainColor, darkMainColor, secondaryColor, darkSecondaryColor, textColor;

    switch (name) {
        case 'Light':
            mainColor = 'rgb(247, 255, 234)';
            darkMainColor = 'rgb(255, 166, 0)';
            secondaryColor = 'lightblue';
            darkSecondaryColor = 'rgb(98, 173, 145)';
            textColor = '#000';
            break;
        case 'Dark':
            darkMainColor = 'rgb(180, 180, 180)';
            mainColor = 'rgb(100, 100, 100)';
            darkSecondaryColor = 'rgb(110, 40, 105)';
            secondaryColor = 'rgb(78, 24, 109)';
            textColor = '#fff';
            break;
        case 'Ukraine':
            mainColor = '#ffffaa';
            darkMainColor = '#ffcc00';
            secondaryColor = '#22aaaa';
            darkSecondaryColor = 'rgb(136, 151, 201)';
            textColor = '#000';
            break;
        case 'American':
            mainColor = 'rgb(255, 200, 200)';
            darkMainColor = 'rgb(255, 0, 0)';
            secondaryColor = 'steelblue';
            darkSecondaryColor = 'rgb(110, 156, 253)';
            textColor = 'rgb(40, 40, 40)';
            break;
    };

    document.querySelector('body').style.backgroundColor = mainColor;
    document.querySelector('body').style.color = textColor;
    document.querySelector('header').style.backgroundColor = secondaryColor;
    document.querySelector('#userName').style.color = textColor;
    document.querySelector('#username').style.backgroundColor = mainColor;
    document.querySelector('#username').style.color = textColor;
    document.querySelector('#enterName').style.color = textColor;
    document.querySelector('#enterName').style.backgroundColor = darkMainColor;
    document.querySelector('#exitButton').style.backgroundColor = darkMainColor;
    document.querySelector('#exitButton').style.color = textColor;
    document.querySelector('.content').style.border = `${secondaryColor} solid 1px`;
    document.querySelector('.nav_topic_item').style.border = `${secondaryColor} solid 1px`;
    document.querySelector('#newTopicButton').style.backgroundColor = darkMainColor;
    document.querySelector('#newTopicButton').style.color = textColor;
    document.querySelector('#select').style.backgroundColor = secondaryColor;
    document.querySelector('#select').style.color = textColor;

    if (window.location.pathname != '/') {
        document.querySelector('.messanger_window').style.border = `${secondaryColor} solid 1px`;
        document.querySelector('#sendMessage').style.backgroundColor = darkMainColor;
        document.querySelector('#sendMessage').style.color = textColor;

        document.querySelectorAll('.closeTopic').forEach( topic => {
            topic.style.color = textColor;
        });
        document.querySelectorAll('.tpc').forEach( topic => {
            topic.style.color = textColor;
        });
        document.querySelectorAll('.myMessage').forEach( message => {
            message.style.backgroundColor = secondaryColor;
        });
        document.querySelectorAll('.deleteMessage').forEach( message => {
            message.style.backgroundColor = darkSecondaryColor;
        });
        document.querySelectorAll('.deleteMessage').forEach( message => {
            message.style.color = textColor;
        });
        document.querySelectorAll('.alienMessage').forEach( message => {
            message.style.backgroundColor = mainColor;
        });
        document.querySelectorAll('.topic_title').forEach( topic => {
            topic.style.backgroundColor = darkSecondaryColor;
        });
        document.querySelectorAll('.topic_title').forEach( topic => {
            topic.style.border = `${secondaryColor} solid 1px`;
        });

        if (localStorage.getItem('activeTopic') != '') {
            document.querySelector('.activeTopic').style.backgroundColor = darkMainColor;
            document.querySelector('.activeTopic').style.border = darkMainColor;
        }
    }


    document.querySelectorAll('#topc').forEach( topc => {
        topc.style.backgroundColor = darkSecondaryColor;
    });
    document.querySelectorAll('#topc').forEach( topc => {
        topc.style.border = `${secondaryColor} solid 1px`;
    });
    document.querySelectorAll('#topic').forEach( topic => {
        topic.style.color = textColor;
    });
    document.querySelectorAll('#topicClose').forEach( topic => {
        topic.style.color = textColor;
    });
}

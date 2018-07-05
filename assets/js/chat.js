var PUB_KEY = "pub-c-20c9ef47-104a-4870-9059-3a837cb30106",
    PUB_SUB_KEY = "sub-c-f6d6072c-ea27-11e6-a5f4-02ee2ddab7fe";
var ch_chat = 'publik_chat', //nama chanel chat
    ch_join = 'joining'; //nama chanel untuk push pesan joining
var user_login, user_ip = $.cookie('user_ip');

var pubnub  =  new PubNub({
    publish_key:PUB_KEY,
    subscribe_key:PUB_SUB_KEY,
    ssl:true
});
pubnub.addListener({
    status: function(statusEvent) {
        // handle jika server offline
        if (statusEvent.category === "PNNetworkDownCategory") {
            swal('Offline', 'Maaf server chat sedang offline', 'error');
        }
    },
    // handle message
    message: function(m) {
        var data = m.message;
        if (m.channel == ch_chat) {
            var isU = 'Anda';
            if(user_ip !== data.ip) {
                isU = data.user;
                dropMessage(data.user, data.message, 'right');
            } else {
                dropMessage(data.user, data.message, 'left');
            }
            return toastr.info(`<b>${isU}</b> mengirimkan <i>`+ data.message.substr(0, 50)+`...</i>`);
        } else if(m.channel == ch_join) {
            toastr.info(data);
        }
    }
});
pubnub.subscribe({
    channels: [ch_chat, ch_join]
});

function getIP() {
    $.getJSON("https://jsonip.com/?callback=?", function (data) {
         $.cookie('user_ip', data.ip, { expires: 1 });
    });
}
var BChat = {
    version: '2.0',
    getDate: function() {
        var d = new Date(), weekday = new Array(7);
        weekday[0] = "Sun"; weekday[1] = "Mon";
        weekday[2] = "Tue"; weekday[3] = "Wed";
        weekday[4] = "Thu"; weekday[5] = "Fri"; weekday[6] = "Sat",
        date = d.getDate();
        var minute = (d.getMinutes() < 10) ? '0'+d.getMinutes() : d.getMinutes();
        return weekday[d.getDay()] + ' ' + date + ', ' + d.getHours() + ':' + minute + ':' +d.getSeconds();
    },
    refreshLogin: function() {
        user_login = $.cookie('uName');
        $('div.chat_window').find('div.title').html(`Selamat datang <b><em>${user_login}</em></b>`);
        pubnub.publish({
            channel : ch_join,
            message : `<b>${user_login}</b> bergabung dengan chat`,
        });
    },
    login: function(user) {
        var user = this.strip_tags(user);
        $.cookie('uName', user, { expires: 1 });
        this.refreshLogin();
    },
    logout: function() {
        swal({
            title: "Keluar dari chat?",
            text: "Anda yakin ingin meninggalkan chat?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((isLogout) => {
            if (isLogout) {
                $.removeCookie('uName');
                location.reload();
            }
        });
    },
    strip_tags: function(text, allow='') {
        allow = (((allow || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
        var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return text.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
    }
}

$(window).on('load', function() {
    getIP();
    if(typeof $.cookie('uName') == 'undefined') {
        swal({
            title:'Masukan Nama',
            content: {
                element:"input",
                attributes:{
                    placeholder: "Type your username",
                    type: "text"
                }
            },
            closeModal: false,
            closeOnClickOutside:false,
        }).then((value) => {
            if (value === "" || value.length <= 3) {
                return location.reload()
            }
            BChat.login(value);
        });
    } else {
        BChat.refreshLogin();
    }
    
});
(function () {
    var Message;
    Message = function (arg) {
        this.user = arg.user, 
        this.text = arg.text,
        this.date = arg.date, 
        this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.find('.text_user').html(_this.user);
                $message.find('.text_date').addClass(_this.message_side).html(_this.date);
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function() {
        var getMessageText, message_side, sendMessage;
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val().substr(0, 1000);
        };
        dropMessage = function (user, text, side='right') {
            message_side = side;
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $messages = $('.messages');
            message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                user: user,
                text: text,
                date: BChat.getDate(),
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        sendMessage = function () {
            var msg = BChat.strip_tags(getMessageText(), '<br><b><i><br/>');
            var date = BChat.getDate();
            var msgarr  = {user:user_login, message:msg, ip:user_ip, waktu:date};
            pubnub.publish({
                channel : ch_chat,
                message : msgarr,
                callback : function(m){
                    console.log(m)
                }
            });
            $('.message_input').val('');
        };
        $('.send_message').click(function (e) {
            return sendMessage()
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage();
            }
        });
        $('.button.close').click(function(e) {
            BChat.logout();
        });
        $('.button.maximize').click(function(e) {
            swal('About me', `Created and developed by @MuhBayu`,'info');
        })
        return setTimeout(function() {
            return dropMessage('MuhBayu', 'Selamat datang di BChat', 'right');
        }, 1000);
    });
}.call(this));
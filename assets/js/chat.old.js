let OFFSET;
$(window).load(function() {
    USER_IP = $('ip').attr('content-val');
    if(BCHAT.getSession()) {
      USER_LOGIN = BCHAT.getSession();
      BCHAT.notifJoin();
      OFFSET = 0;
    } else {
      $('#modal1').modal('open');
    }
    //setTimeout(dapatIP,3000);
    setTimeout(lihat, 2000);
});
$(window).scroll(function() {
  if ($(window).scrollTop() == 0 ) {
    OFFSET = $('div#chatContainer').length;
    lihat('more');
  }
});

function auto_grow(element) {
      element.style.height = "2px";
      element.style.height = (element.scrollHeight)+"px";
}

$(document).ready(function(){
    //$.ajaxSetup({ cache: false });
    $('.tooltipped').tooltip({delay: 50});
    $(".button-collapse").sideNav();
    $('.modal').modal({
        dismissible: false,       
        opacity: .7
    });
    $('#btn-agree').click(function() {
        var nama  = $('#ses_user').val(),
            regex = new RegExp("^[a-zA-Z0-9]+$");
         if (!regex.test(nama)) {
              $('#modal-warning').text('*Pastikan isi dengan benar'); return false;
         } else {
              $('#modal1').modal('close');
              USER_LOGIN = nama;
              BCHAT.setUser(nama);
              BCHAT.notifJoin();
              
         }
    });
    $('a[data-query=logout').click(function() {
      BCHAT.logout();
    });
});

  var pubnub  =  PUBNUB.init({
                    publish_key:P_KEY,
                    subscribe_key:S_KEY,
                    ssl:true
                });
  var box     = PUBNUB.$('message_konten'), 
      input   = PUBNUB.$('text-message'), 
      channel = 'chat';
  pubnub.subscribe({
      channel  : channel,
      callback : function(text) { 
                  count_chat = count_chat + 1;
                  BCHAT.updateTitle(count_chat);
              var pesan = BCHAT.strip_tags(text.pesan, '<img><br><a>'),
                  pid   = text.id ,
                  pos = (text.ip != USER_IP) ? "kiri" : "kanan" ,
                  img = (pos == 'kiri') ? '<img class="circle left" width="50px" src="'+BCHAT.randImage()+'">' : '' ,
                  usn = (pos == 'kiri') ? '<span class="username left">'+text.user+'</span><br/>' : '';
              var htm  = '<div class="col s12 m12 l12" id="cht'+pid+'">';
                  htm += img;
                  htm += '<div id="chatContainer" class="'+pos+'">';
                  htm += usn; 
                  htm += pesan.nl2br();
                  htm += '<br><span class="time">'+ text.waktu + '</span>';
                  htm += '</div>';
                  htm += '</div>';
                  $('#message_konten').append(htm);
                  //$('#cht'+pid).hide();$('#cht'+pid).slideToggle(100);
                  if(text.ip != USER_IP) {
                    Materialize.toast("Pesan dari: " + text.user, 1000);
                  }
                  scrollDown();
             },
  });
  pubnub.subscribe({
      channel  : 'room',
      callback : function(text) { 
                  Materialize.toast(text, 3000);
      },
  });
  $("#text-message").on("keydown", function(e) {
      if(enter_to_send != 1) {
          if(e.which === 13 && e.altKey) {
            ngirim();   
          }
      } else {
          if(e.which === 13) {
            e.preventDefault();
            ngirim();   
          }
      }
   });
  $('#btn-send').on("click", function() {
    ngirim();
  });
function ngirim() {
        if(input.value.length < 3) {
            Materialize.toast('Pesan harus lebih dari 3 karakter..',900);
            return false;
        }
        start = start + 1;
        var sensor = BCHAT.sensorKata(input.value); 
        var isi   = BCHAT.convertLink(sensor),
            d     = new Date(),
            t     = BCHAT.getTgl();
        var arr   = {id:start, user:USER_LOGIN, pesan:isi, ip:USER_IP, waktu:t};
        var ngirim = pubnub.publish({
              channel : channel, 
              message : arr, 
              x : (input.value=''),
            });
        kirimDB(isi);
        scrollDown();
}
function scrollDown() {
  $('html, body').animate({scrollTop: $(document).height()}, 600);
}
function kirimDB(text) {
  $.ajax({
    url:'api/?q=insert&token='+token,
    type:'POST',
    dataType:'json',
    data: {
      'user':USER_LOGIN,
      'isi':text,
      'ip':USER_IP
    },
    cache: false,
    success:function(respon) {
      //Materialize.toast('Berhasil', 2000);
    },
    fail:function(response) {
      Materialize.toast('Gaagl mengirim... karena server sibuk', 2000);
    }
  });
}
function dapatIP() {
    $.getJSON("http://jsonip.com/?callback=?", function (data) {
        console.log(data);
        USER_IP = data.ip;
    });
}
function lihat(p='new') {
  $.getJSON('api/?q=view&token='+token+'&offset='+OFFSET, function(json) {
    if(json.status == 'success') {
        count_chat = json.data.count;
        BCHAT.updateTitle(count_chat);
        $.each(json.data.chat, function(i, val) {
                var pos = (val.ip != USER_IP) ? "kiri" : "kanan",
                    img = (pos == 'kiri') ? '<img class="circle left" height="50px" src="'+BCHAT.randImage()+'">' : '',
                    usn = (pos == 'kiri') ? '<span class="username left">'+val.user+'</span><br/>' : '';
                var htm  = '<div class="col s12 m12 l12" chat-id="'+val.id_chat+'">';
                    htm += img;
                    htm += '<div id="chatContainer" class="'+pos+'">';
                    htm += usn;
                    htm += BCHAT.strip_tags(val.chat, '<img><br><a>');
                    htm += '<br><span class="time">'+ val.times + '</span>';
                    htm += '</div>';
                    htm += '</div>';
                    if(p=='new') {
                      $('#message_konten').append(htm).fadeIn(700);
                    } else if(p=='more') {
                      $('#message_konten').prepend(htm).fadeIn(700);
                    }
                    
        });
        console.log(OFFSET);
    } else {
                Materialize.toast(json.message, 5000);
    }
  }).error(function() {
                Materialize.toast('Terjadi kesalahan saat mengambil data di Server..', 5000);
  }).success(function() {
      $('#preload').hide();
  });

}
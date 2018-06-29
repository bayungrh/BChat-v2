<!DOCTYPE html>
<html>
<head>
    <meta charset=utf-8>
    <meta content="IE=edge" http-equiv=X-UA-Compatible>
    <meta content="width=device-width,initial-scale=1" name=viewport>
    <title>BChat v2</title>
    <link rel="icon" href="<?= base_url('assets/img/bchat.ico');?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.1/css/bootstrap.min.css" />
    <link rel="stylesheet" href="<?= site_url('assets/css/chat.min.css'); ?>" />
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" />
    <script type="text/javascript" src="https://cdn.pubnub.com/sdk/javascript/pubnub.4.21.2.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
    <script type="text/javascript" src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
</head>
<body>
<a href="https://github.com/MuhBayu" target="_blank" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#64CEAA; color:#fff; position: absolute; top: 0; border: 0; right: 0; z-index: 999;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
<script language="JavaScript" type="text/javascript">
document.write(unescape('%3Cdiv%20class%3D%22chat_window%22%3E%0A%20%20%20%20%3Cdiv%20class%3D%22top_menu%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22buttons%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22button%20close%22%20title%3D%22Logout%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22button%20minimize%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22button%20maximize%22%20title%3D%22About%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22title%22%3EBChat%20v2%3C/div%3E%0A%20%20%20%20%3C/div%3E%0A%20%20%20%20%3Cul%20class%3D%22messages%22%3E%3C/ul%3E%0A%20%20%20%20%3Cdiv%20class%3D%22bottom_wrapper%20clearfix%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22message_input_wrapper%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20class%3D%22message_input%22%20placeholder%3D%22Type%20your%20message%20here...%22%20maxlength%3D%221000%22%20/%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Cbutton%20class%3D%22send_message%20text-uppercase%22%3EKirim%3C/button%3E%0A%20%20%20%20%3C/div%3E%0A%3C/div%3E%0A%3Cdiv%20class%3D%22message_template%22%3E%0A%20%20%20%20%3Cli%20class%3D%22message%22%3E%0A%20%20%20%20%20%20%20%20%3Cimg%20src%3D%22assets/img/uChat.png%22%20class%3D%22img-circle%20ava%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22text_wrapper%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstrong%20class%3D%22text_user%22%3E%3C/strong%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22text%22%3E%3C/div%3E%0A%20%20%20%20%20%20%20%20%3C/div%3E%0A%20%20%20%20%20%20%20%20%3Csmall%20class%3D%22text_date%22%3E2018%3C/small%3E%0A%20%20%20%20%3C/li%3E%0A%3C/div%3E'));
</script>
<script type="text/javascript">
var _737263='<?= bin2hex(site_url('assets/js/chat.js'));?>';
function hex2bin(r){for(var n=[],t=0;t<r.length-1;t+=2)n.push(parseInt(r.substr(t,2),16));return String.fromCharCode.apply(String,n)}
var _0x4892=["\x73\x63\x72\x69\x70\x74","\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74","\x73\x72\x63","\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64","\x68\x65\x61\x64"];var imported=document[_0x4892[1]](_0x4892[0]);imported[_0x4892[2]]= hex2bin(_737263),document[_0x4892[4]][_0x4892[3]](imported)
</script>
</body>
</html>
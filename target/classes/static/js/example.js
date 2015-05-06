var n = network;

var inFocus = true;
var chatLog;

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var handler = {
  connect: function() {
    $("#color").val(generateColor());

  },

  /**
   * Called when the user reconnects after disconnecting.
   */
  reconnect: function() {
    $("#status").html("Status: connected.");
    alert("hi we're back online!");
  },

  /**
   * Lets the user know they have disconnected.
   */
  disconnect: function() {
    $("#status").html("Status: disconnected.");
  },

  chat: function(log) {
    chatLog = log;

    var html;
    if (!($("#reverseFeed").is(":checked"))) {

      html = " CHAT: (newest messages are always at the bottom) <br>" + html;;
      for (var key in chatLog) {
        html += formatMessage(chatLog[key]);
      }

      html += "<div id=\"bot\">";
    } else {

      html = "<div id=\"bot\">";
      for (var key in chatLog) {
        var textColor = (/^#[0-9A-F]{6}$/i.test(chatLog[key].color) ? chatLog[key].color : "#000000");
        html = formatMessage(chatLog[key]) + html;
      }

      html = " CHAT: (newest messages are always at the top) <br>" + html;
    }
    $("#chat").html(html);
    if (!inFocus) {
      clearInterval(titleTimer);
      titleTimer = setInterval(changeTitle, 300);
    }

    var textarea = document.getElementById('chat');
    textarea.scrollTop = textarea.scrollHeight;
  },

  connected: function(conn) {
    var count = 0;
    var totalCount = 0;
    for (var key in conn) {
      if (conn[key]) {
        count++;
      }
      totalCount++;
    }

    $("#count").html("Connected users: " + count + "<br>" + "Total ever connected: " + totalCount);
  },
}

$(window).focus(function() {
  clearInterval(titleTimer);
  document.title = "ChattyChat";
  inFocus = true;
});

$(window).blur(function() {
  inFocus = false;
})

function formatMessage(chat) {
  var msg = chat.message;
  var color = chat.color;
  var player = chat.player;
  player = (player === "" ? "anonymous": player);

  var textColor = (/^#[0-9A-F]{6}$/i.test(color) ? color : "#000000");
  var playerColor = textColor;
  return "<div class=\"message semi-transparent\" style=\"background: " + (/^#[0-9A-F]{6}$/i.test(color) ? complement(color) : '#ffffff')+ ";\"> <b>"  + '<span style="color: ' + textColor + ';">' + player + ":" +  "</b>" + '</span>' + " " + '<span style="color: ' + '"white"' + ';">' + formatMessageBody(msg, "#ffffff") + "</span>" + "</div>";
}

function formatMessageBody(msg, color) {
  msg = msg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  msg = urlify(msg, color);
  return msg;
}

function urlify(text, color) {
    var urlRegex = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
    return text.replace(urlRegex, function(url) {
      url = url.trim();
      var linkUrl = url;
      var dispUrl = url;

      if (!(url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://')) {
        linkUrl = 'http://' + url;
      }

      var linkUrl2 = linkUrl;

      if (linkUrl.indexOf('?') != -1) {
        linkUrl2 = linkUrl.substring(0, linkUrl.indexOf('?'));
      }

      if (linkUrl.indexOf("youtube.com/watch?") != -1 && ($('#embedYouTubeVideos').is(":checked"))) {
        var id = linkUrl.substring(linkUrl.indexOf('?v=') + 3, linkUrl.length);
        return '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>'
      }

      if ((linkUrl2.endsWith(".jpg") || linkUrl2.endsWith(".png") || linkUrl2.endsWith(".gif") || linkUrl2.endsWith(".jpeg")) && ($('#showImages').is(":checked"))) {

        var img = '<img src="' + linkUrl + '"';
        if (!($("#largeImages").is(":checked"))) {
          img += 'height="128"';
        } else {
          img += 'width="100%"';
        }
        img += '>';
        if ($("#showLinks").is(":checked")) {
          img = '<a href="' + linkUrl + '">' + img + '</a>';
        }
        return img;
      }
      if ($("#showLinks").is(":checked")) {
        return ' <a href="' + linkUrl + '" style="color:' + color + '">' + dispUrl + '</a> ';
      } else {
        return ' <span style="color: #666666">[url hidden]</span> ';
      }
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

function changeTitle() {
  if (document.title === "A new message") {
    document.title = "ChattyChat";
  } else {
    document.title = "A new message";
  }
}

var titleTimer;

var submit = function() {
  if ($("#message").val().trim() === "") {
    return;
  }

  var msg = $("#message").val().trim();
  msg = (msg.length > 5000 ? msg.substring(0, 5000) : msg);
  console.log(msg.length);

  var response = {
    name: $("#name").val().trim(),
    message: msg,
    color: (/^#[0-9A-F]{6}$/i.test($("#color").val().trim()) ? $("#color").val().trim() : "#333333"),
  }

  $("#message").val('');
  network.say("chat", response);
}

function simpleHandler(val) {
  console.log(val);
}

$('#message').bind("enterKey",function(e){
  submit();
});

$('#message').keyup(function(e){
  if(e.keyCode == 13) {
    $(this).trigger("enterKey");
  }
});

$("#submit").on('click', submit);

$(".setting").on('click', function() {
  handler.chat(chatLog);
});

// complement
function complement(hex) {
  var rgb = hexToRgb(hex);
  var hsv = RGB2HSV(rgb);
  if ($('#funColors').is(":checked")) {
    hsv.hue = HueShift(hsv.hue, 180.0);
  }
  hsv.value = (hsv.value + 50) % 100;
  rgb = HSV2RGB(hsv);
  hex = RGB2HTML(rgb.r, rgb.g, rgb.b);
  return hex;
}

function lighten(hex) {
  var rgb = hexToRgb(hex);
  var hsv = RGB2HSV(rgb);
  rgb = HSV2RGB(hsv);
  hex = RGB2HTML(rgb.r, rgb.g, rgb.b);
  return hex;
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function RGB2HTML(red, green, blue) {
  return 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ',0.5)';
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function RGB2HSV(rgb) {
    hsv = new Object();
    max=max3(rgb.r,rgb.g,rgb.b);
    dif=max-min3(rgb.r,rgb.g,rgb.b);
    hsv.saturation=(max==0.0)?0:(100*dif/max);
    if (hsv.saturation==0) hsv.hue=0;
    else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
    else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
    else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
    if (hsv.hue<0.0) hsv.hue+=360.0;
    hsv.value=Math.round(max*100/255);
    hsv.hue=Math.round(hsv.hue);
    hsv.saturation=Math.round(hsv.saturation);
    return hsv;
}

// RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
// which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
function HSV2RGB(hsv) {
    var rgb=new Object();
    if (hsv.saturation==0) {
        rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
    } else {
        hsv.hue/=60;
        hsv.saturation/=100;
        hsv.value/=100;
        i=Math.floor(hsv.hue);
        f=hsv.hue-i;
        p=hsv.value*(1-hsv.saturation);
        q=hsv.value*(1-hsv.saturation*f);
        t=hsv.value*(1-hsv.saturation*(1-f));
        switch(i) {
        case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
        case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
        case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
        case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
        case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
        default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
        }
        rgb.r=Math.round(rgb.r*255);
        rgb.g=Math.round(rgb.g*255);
        rgb.b=Math.round(rgb.b*255);
    }
    return rgb;
}

//Adding HueShift via Jacob (see comments)
function HueShift(h,s) { 
    h+=s; while (h>=360.0) h-=360.0; while (h<0.0) h+=360.0; return h; 
}

//min max via Hairgami_Master (see comments)
function min3(a,b,c) { 
    return (a<b)?((a<c)?a:c):((b<c)?b:c); 
} 
function max3(a,b,c) { 
    return (a>b)?((a>c)?a:c):((b>c)?b:c); 
}


function generateColor(ranges) {
            if (!ranges) {
                ranges = [
                    [150,256],
                    [0, 190],
                    [0, 30]
                ];
            }
            var g = function() {
                //select random range and remove
                var range = ranges.splice(Math.floor(Math.random()*ranges.length), 1)[0];
                //pick a random number from within the range
                return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
            }
            return rgbToHex(g(), g(), g())
        };

mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

if (!mobilecheck()) {
  $("#reverseFeed").prop('checked', true);
}

$(window).bind('resize', resize);

function resize() {
  var h = $(window).height() - 260;
  $("#chat-container").height(h);
}

resize();


<html>
  <head>
    <meta charset="utf-8">
    <title>A new message</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/html5bp.css">
    <link rel="stylesheet" href="css/networkmain.css">
  </head>
  <body>
    <div id="head">
      Connect to this chat by visiting ${url}. <br>

      <div id="count">
        <!-- number of users -->
      </div>
    </div>

    <div id="chat-container">
    <div id="chat">
      <!-- chat log -->
    </div>
  </div>

    <div id="tail">

      <input type="text" id="name" placeholder="name">
      <input type="text" id="message" placeholder="message">
      <input type="color" id="color" placeholder="hex color">
      <input type="submit" id="submit" value="send">

      <div id="settings">
        [<input type="checkbox" class="setting" id="funColors">&nbsp;Fun&nbsp;Colors]
        [<input type="checkbox" class="setting" id="showImages" checked="true">&nbsp;Show&nbsp;Images]
        [<input type="checkbox" class="setting" id="largeImages">&nbsp;Large&nbsp;Images]
        [<input type="checkbox" class="setting" id="showLinks" checked="true">&nbsp;Show&nbsp;Links]
        [<input type="checkbox" class="setting" id="reverseFeed">&nbsp;Reverse&nbsp;Feed]
        [<input type="checkbox" class="setting" id="embedYouTubeVideos">&nbsp;Embed&nbsp;YouTube&nbsp;Videos&nbsp;(beta)]

      </div>
    </div>


    <script src="js/jquery-2.1.1.js"></script>
    <script src="js/network.js"></script>
    <script src="js/example.js"></script>
  </body>
</html>

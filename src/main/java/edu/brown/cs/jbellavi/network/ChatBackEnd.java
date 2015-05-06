package edu.brown.cs.jbellavi.network;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ChatBackEnd implements BackEnd{
  private Server s;
  private List<Map<String, String>> chatLog;

  @Override
  public Object answer(int player, String field, Map<String, String> val) {
    switch(field) {
      case "chat":
        handleChat(val);
        return null;

      default: 
        return null;
    }
  }

  @Override
  public BackEnd setServer(Server s) {
    this.s = s;
    return this;
  }

  private void handleChat(Map<String, String> fields) {
    if (chatLog == null) {
      chatLog = new ArrayList<Map<String, String>>();
    }
    chatLog.add(fields);
    int len = chatLog.size();
    if (len > 5) {
      chatLog = chatLog.subList(len - 5, len);
    }
    s.putField("chat", chatLog);
  }
}

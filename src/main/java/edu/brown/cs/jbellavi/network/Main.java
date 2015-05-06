package edu.brown.cs.jbellavi.network;

public class Main {
  public static void main(String[] args) {
    Network.getNetwork(args).setServer(new MainServer().talk()).setBackEnd(new ChatBackEnd()).go();
  }
}

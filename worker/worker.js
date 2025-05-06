export class Room {
    constructor(state) {
      this.state = state;
      this.clients = new Map();
    }
  
    async fetch(req) {
      if (req.headers.get("Upgrade") != "websocket") {
        return new Response("Expected WebSocket", { status: 426 });
      }
  
      const { searchParams } = new URL(req.url);
      const name = searchParams.get("name") || "Anonymous";
  
      const [client, server] = Object.values(new WebSocketPair());
      this.handleSession(server, name);
  
      return new Response(null, { status: 101, webSocket: client });
    }
  
    handleSession(ws, name) {
      const id = crypto.randomUUID();
      this.clients.set(id, { ws, name });
  
      const broadcast = (text, sys = false) => {
        const time = new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        });
        
        for (const client of this.clients.values()) {
          client.ws.send(JSON.stringify({ name: sys ? "System" : name, text, time }));
        }
      };
  
      ws.accept();
      broadcast(`${name} has entered the room`, true);
  
      ws.addEventListener("message", msg => {
        const { text } = JSON.parse(msg.data);
        broadcast(text);
      });
  
      ws.addEventListener("close", () => {
        this.clients.delete(id);
        broadcast(`${name} has left the room`, true);
      });
    }
  }
  
  export default {
    async fetch(req, env, ctx) {
      const url = new URL(req.url);
      const roomName = url.pathname.split("/").pop();
      const id = env.ROOMS.idFromName(roomName);
      const stub = env.ROOMS.get(id);
      return stub.fetch(req);
    },
  };
  
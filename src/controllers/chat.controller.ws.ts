import {Socket} from 'socket.io';
import {ws} from '../websockets/decorators/websocket.decorator';

/**
 * A demo controller for websocket
 */
@ws({ name: 'chatNsp', namespace: /^\/chats\/\d+$/  })
export class ChatControllerWs {
  constructor(
    @ws.socket() // Equivalent to `@inject('ws.socket')`
    private socket: Socket,
  ) {}

  /**
   * The method is invoked when a client connects to the server
   * @param socket
   */
  @ws.connect()
  async connect(socket: Socket) {
    console.log('Client connected: %s', this.socket.id);
    await socket.join('room 1');
    // Room notification of request /todos/room/example/emit (TodoController)
    await socket.join('some room');
  }

  /**
   * Register a handler for 'chat message' events
   * @param msg
   */
  @ws.subscribe('chat message')
  // @ws.emit('namespace' | 'requestor' | 'broadcast')
  handleChatMessage(msg: unknown) {
    console.log('Chat message: %s', msg);
    this.socket.nsp.emit('chat message', `[${this.socket.id}] ${msg}`);
  }

  /**
   * Register a handler for all events
   * @param msg
   */
  @ws.subscribe(/.+/)
  logMessage(...args: unknown[]) {
    console.log('Message: %s', args);
  }

  /**
   * The method is invoked when a client disconnects from the server
   * @param socket
   */
  @ws.disconnect()
  disconnect() {
    console.log('Client disconnected: %s', this.socket.id);
  }
}

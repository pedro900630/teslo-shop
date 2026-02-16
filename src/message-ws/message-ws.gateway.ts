import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true, namespace: '/' })
// Comment: This is namespace  by  default '/'
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messageWsService: MessageWsService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.messageWsService.registerClient(client);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    console.log('Client disconnected', client.id);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }
}

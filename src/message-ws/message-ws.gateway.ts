import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true, namespace: '/' })
// Comment: This is namespace  by  default '/'
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss!: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    // console.log(client);
    const token = client.handshake.headers.autentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
      console.log({ token, payload });
    } catch {
      client.disconnect();
      return;
    }

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

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // console.log({ payload, clientId: client.id });
    // this.wss.emit('message-from-server', {
    //   fullName: 'Soy yo, el server',
    //   payload,
    // });
    // ! Emite Solo al cliente que envió el mensaje
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo, el server',
    //   payload,
    // });
    // ! Emite a todos los clientes excepto al que envió el mensaje
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo, el server',
    //   payload,
    // });
    // ! Emite a todos los clientes incluyendo al que envió el mensaje
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no-message',
    });

    // this.wss.emit('message-from-server', {
    //   fullName: 'Soy yo, el server',
    //   payload,
    // });
  }
}

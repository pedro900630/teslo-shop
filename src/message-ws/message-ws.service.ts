import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
  [id: string]: { socket: Socket };
}

@Injectable()
export class MessageWsService {
  private connectedClients: ConnectedClients = {};

  registerClient(client: Socket) {
    this.connectedClients[client.id] = {
      socket: client,
      //   user: user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }
}

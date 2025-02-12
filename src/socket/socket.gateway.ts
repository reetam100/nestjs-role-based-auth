import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private rooms = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    console.log(`⚡ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // Remove the client from any rooms they were in
    this.rooms.forEach((clients, room) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.rooms.delete(room);
      }
    });
  }

  // Join room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    client.join(roomId);

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)?.add(client.id);

    console.log(`Client ${client.id} joined room: ${roomId}`);
    this.server
      .to(roomId)
      .emit('roomUpdate', { message: `User joined room ${roomId}` });
  }

  // Leave a room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    client.leave(roomId);

    this.rooms.get(roomId)?.delete(client.id);
    if (this.rooms.get(roomId)?.size === 0) {
      this.rooms.delete(roomId);
    }

    console.log(`Client ${client.id} left room: ${roomId}`);
    this.server
      .to(roomId)
      .emit('roomUpdate', { message: `User left room ${roomId}` });
  }

  @SubscribeMessage('placeBid')
  handleNewBid(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; bidAmount: number; bidder: string },
  ) {
    const { roomId, bidAmount, bidder } = data;

    console.log(`Bid received in room ${roomId}: ${bidAmount} by ${bidder}`);

    this.server.to(roomId).emit('newBid', { bidAmount, bidder });
  }
}

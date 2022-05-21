import { ApplicationConfig } from '@loopback/core';
import { RestApplication } from '@loopback/rest';
import { WebSocketServer } from "./websocket.server";
import { Constructor } from "@loopback/context";
import { Namespace } from "socket.io";

export { ApplicationConfig };

export class WebsocketApplication extends RestApplication {
  readonly wsServer: WebSocketServer;

  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.wsServer = new WebSocketServer(this, options?.socketio);
  }

  public websocketRoute(controllerClass: Constructor<{ [method: string]: Function }>, namespace?: string | RegExp): Namespace {
    return this.wsServer.route(controllerClass, namespace) as Namespace;
  }

  public async start(): Promise<void> {
    await super.start();
    const httpServer = this.restServer.httpServer?.server;
    await this.wsServer.start(httpServer!);
  }

  public async stop(): Promise<void> {
    await this.wsServer.stop();
    await super.stop();
  }
}

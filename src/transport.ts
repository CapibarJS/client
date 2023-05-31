interface ITransport {
  build(args: any): Promise<any>;
  getExecutor(namespace: string, method: string): (args: any) => Promise<any>;
}

export class Transport implements ITransport {
  protocol: string;
  host: string;
  port: string;
  url: string;
  base: string;

  constructor(url: string) {
    const { protocol, host, port, pathname } = new URL(url);
    this.protocol = protocol;
    this.host = host;
    this.port = port;
    this.url = url;
    this.base = pathname.length > 1 ? pathname.slice(1) : 'api';
  }

  getExecutor(namespace: string, method: string) {
    return (...args) => Promise.resolve(args);
  }

  build = (args) => Promise.resolve(args);

  static scaffold(url) {
    const protocol = url.startsWith('ws:') ? 'ws' : 'http';
    const transport = {
      ws: WsClient,
      http: HttpClient,
    };
    return new transport[protocol](url);
  }
}

class HttpClient extends Transport {
  constructor(url) {
    super(url);
  }

  getExecutor(namespace: string, method: string): (args: any) => Promise<any> {
    return (...args) =>
      new Promise((resolve, reject) => {
        fetch(`${this.url}/${this.base}/${namespace}/${method}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: namespace, method, args }),
        }).then((res) => {
          if (res.status === 200) resolve(res.json());
          else reject(new Error(`Status Code: ${res.status}`));
        });
      });
  }
}

class WsClient extends Transport {
  socket: WebSocket;

  constructor(url) {
    super(url);
    this.socket = new WebSocket(this.url);
  }

  getExecutor(namespace, method): (args: any) => Promise<any> {
    return (...args) =>
      new Promise((resolve) => {
        const packet = { name: namespace, method, args };
        this.socket.send(JSON.stringify(packet));
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          resolve(data);
        };
      });
  }

  build = (args) =>
    new Promise((resolve, reject) => {
      this.socket.onopen = () => resolve(args);
      this.socket.onclose = () => reject('Cannot connect to socket.');
    });
}

import { ApiRPC } from './src/api';

type CapibarModuleOptions = {
  clients?: Record<string, string>;
  isExplorer?: boolean;
};

export class CapibarModule {
  clients = {};
  rpc: Record<string, ApiRPC> = {};

  constructor(options: CapibarModuleOptions = {}) {
    if (!options.clients) options.clients = {};
    options.isExplorer = options.isExplorer ?? false;
    // Clients
    for (const [name, defs] of Object.entries(options.clients)) {
      if (typeof defs === 'string')
        this.rpc[name] = new ApiRPC(defs, options.isExplorer);
    }
  }

  async build() {
    for await (const [name, apiRpc] of Object.entries(this.rpc)) {
      this.clients[name] = await apiRpc.build();
    }
  }

  static async buildClient(source: string) {
    const api = new CapibarModule({
      clients: {
        [source.startsWith('ws') ? 'ws' : 'http']: source,
      },
    });
    await api.build();
    return api;
  }
}

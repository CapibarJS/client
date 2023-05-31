import {ApiRPC} from "./src/api";

type CapibarModuleOptions = {
  clients?: Record<string, string>
}

export class CapibarModule {
  clients = {};
  rpc: Record<string, ApiRPC> = {};

  constructor(options: CapibarModuleOptions = {}) {
    if (!options.clients) options.clients = {};
    // Clients
    for (const [name, defs] of Object.entries(options.clients)) {
      if (typeof defs === 'string') this.rpc[name] = new ApiRPC(defs);
    }
  }

  async build() {
    for await (const [name, apiRpc] of Object.entries(this.rpc)) {
      this.clients[name] = await apiRpc.build();
    }
  }
}

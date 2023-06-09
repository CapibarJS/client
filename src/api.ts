import { Transport } from './transport';
import { objectSet } from '../utils/struct';

export class ApiRPC {
  api = {};
  structureMap = new Map();
  schemas = {};
  config = {};
  private transport: Transport;

  constructor(url: string, protected isExplorer?: boolean) {
    this.transport = Transport.scaffold(url);
    this.api = {};
    this.structureMap = new Map();
  }

  async syncApi() {
    const syncStruct = this.transport.getExecutor('_', 'introspect');
    const response: any = await syncStruct({ typing: this.isExplorer });
    const { ['#schemas']: schemas, ['#api']: config, ...structure } = response;
    this.schemas = schemas;
    this.config = config;
    const setMethod = (namespace, method) =>
      this.transport.getExecutor(namespace, method);
    for (const path of Object.keys(structure)) {
      const keys = path.split('.');
      const method = keys.pop();
      const namespace = keys.join('.');
      const options = structure[path];
      this.structureMap.set(path, { method, namespace, ...options });
      objectSet(this.api, path, setMethod(namespace, method));
    }
  }

  build = async () => {
    this.transport.build(this.api).then();
    await this.syncApi();
    return this.api;
  };
}

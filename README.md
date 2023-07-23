# CapibarJS - client `@capibar/client`

Lightest RPC client for the `@capibar/core` server

1. Install package:
   ```shell
   npm install @capibar/client
   # or
   yarn add @capibar/client
   ```

2.  Using:
    ```javascript
    import { CapibarModule } from '@capibar/client'

    // Create client instance
    const client = await CapibarModule.buildClient('https://example.ru/api')
    // Call rpc method
    console.log(await client.rpc.http.api.notes.findMany())
    ```

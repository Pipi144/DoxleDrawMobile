import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {QueryClientManager, reactotronReactQuery} from 'reactotron-react-query';
import {QueryClient} from '@tanstack/react-query';
const queryClient = new QueryClient();

const queryClientManager = new QueryClientManager({
  // @ts-ignore
  queryClient,
});
const tron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'Doxle',
  })
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: {veto: () => false}, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect();
Reactotron.use(reactotronReactQuery(queryClientManager))
  .configure({
    onDisconnect: () => {
      queryClientManager.unsubscribe();
    },
  })
  .useReactNative()
  .connect();

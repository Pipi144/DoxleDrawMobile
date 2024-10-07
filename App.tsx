import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {NotificationProvider} from './src/Providers/NotificationProvider';
import {AuthProvider} from './src/Providers/AuthProvider';
import {InternetConnectionProvider} from './src/Providers/InternetConnectionProvider';
import {OrientationProvider} from './src/Providers/OrientationContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useEffect} from 'react';
import {CompanyProvider} from './src/Providers/CompanyProvider';

import {DOXLEThemeProvider} from './src/Providers/DoxleThemeProvider/DoxleThemeProvider';
import {EventProvider} from 'react-native-outside-press';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {UserProvider} from './src/Providers/UserProvider';
import {VibrationProvider} from './src/Providers/VibrationProvider';
import {enableFreeze} from 'react-native-screens';
import {registerTranslation, en as PaperEn} from 'react-native-paper-dates';
registerTranslation('en', PaperEn);
import SplashScreen from 'react-native-splash-screen';

enableFreeze(true);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * (60 * 1000), // 2 mins
      gcTime: 5 * (60 * 1000), // 5 mins
      retryDelay: 3 * 1000, // 3 seconds,
    },
  },
});
function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <OrientationProvider>
          <DOXLEThemeProvider>
            <NotificationProvider>
              <InternetConnectionProvider>
                <VibrationProvider>
                  <AuthProvider>
                    <CompanyProvider>
                      <UserProvider>
                        <EventProvider style={{flex: 1}}>
                          <GestureHandlerRootView
                            style={{flex: 1}}></GestureHandlerRootView>
                        </EventProvider>
                      </UserProvider>
                    </CompanyProvider>
                  </AuthProvider>
                </VibrationProvider>
              </InternetConnectionProvider>
            </NotificationProvider>
          </DOXLEThemeProvider>
        </OrientationProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;

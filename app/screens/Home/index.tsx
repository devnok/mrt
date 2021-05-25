import * as loginActions from 'app/store/actions/loginActions';

import BackgroundGeolocation, {
  Location,
  MotionActivityEvent,
  MotionChangeEvent,
  ProviderChangeEvent,
} from 'react-native-background-geolocation';
import React, { useEffect } from 'react';

import { Button } from 'react-native-paper';
import { View } from 'react-native';
import styles from './styles';
import { useDispatch } from 'react-redux';

const Home: React.FC = () => {
  const onLocation = (location: Location) => {
    console.log('[location] -', location);
  };
  const onActivityChange = (event: MotionActivityEvent) => {
    console.log('[activitychange] -', event); // eg: 'on_foot', 'still', 'in_vehicle'
  };
  const onProviderChange = (provider: ProviderChangeEvent) => {
    console.log('[providerchange] -', provider.enabled, provider.status);
  };
  const onMotionChange = (event: MotionChangeEvent) => {
    console.log('[motionchange] -', event.isMoving, event.location);
  };
  useEffect(() => {
    BackgroundGeolocation.onLocation(onLocation);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(onProviderChange);

    BackgroundGeolocation.onHeartbeat(event => {
      console.log('[onHeartbeat] ', event);

      // You could request a new location if you wish.
      BackgroundGeolocation.getCurrentPosition({
        samples: 1,
        persist: true,
      }).then(location => {
        console.log('[getCurrentPosition] ', location);
      });
    });
    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready(
      {
        heartbeatInterval: 10,
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        // Activity Recognition
        stopTimeout: 1,
        // Application config
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        // HTTP / SQLite config
        url: 'http://yourserver.com/locations',
        batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
        headers: {
          // <-- Optional HTTP headers
          'X-FOO': 'bar',
        },
        params: {
          // <-- Optional HTTP params
          auth_token: 'maybe_your_server_authenticates_via_token_YES?',
        },
      },
      state => {
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled,
        );

        if (!state.enabled) {
          ////
          // 3. Start tracking!
          //
          BackgroundGeolocation.start(function () {
            console.log('- Start success');
          });
        }
      },
    );

    return () => {
      BackgroundGeolocation.removeListeners();
    };
  });
  const dispatch = useDispatch();
  const onLogout = () => dispatch(loginActions.logOut());

  return (
    <View style={styles.container}>
      <Button icon="logout" mode="outlined" onPress={onLogout}>
        Logout
      </Button>
    </View>
  );
};

export default Home;

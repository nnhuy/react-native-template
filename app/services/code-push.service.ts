import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import codePush from 'react-native-code-push';
import {eventEmitter} from '../contexts';
import config from '../config';
import {EVENT} from '../constants/event';

const CodePushDataKey = 'codepush:data';

const checkUpdateApp = async () => {
  await AsyncStorage.removeItem(CodePushDataKey);
  const deploymentKey =
    Platform.select({
      ios: config.code_push_key_ios,
      android: config.code_push_key_android,
    }) || '';

  const data = await codePush.checkForUpdate(deploymentKey);
  console.log('===data update app===', data);

  let oldData: any = await AsyncStorage.getItem(CodePushDataKey);
  oldData = oldData ? JSON.parse(oldData) : undefined;
  if (oldData?.packageHash === data?.packageHash) {
    // return;
  }
  await AsyncStorage.setItem(CodePushDataKey, JSON.stringify(data));

  console.log('===data===', data);
  eventEmitter.emit(EVENT.application.updating, {updating: !!data});
  if (data) {
    console.log('===doUpdateApp===');
    doUpdateApp();
    return true;
  }
  return false;
};

const doUpdateApp = () => {
  const deploymentKey =
    Platform.select({
      ios: config.code_push_key_ios,
      android: config.code_push_key_android,
    }) || '';
  codePush.sync(
    {installMode: codePush.InstallMode.IMMEDIATE, deploymentKey},

    status => {
      console.log('========================status===', status);

      status === 0 &&
        eventEmitter.emit(EVENT.application.updating, {updating: false});
    },

    ({receivedBytes, totalBytes}) => {
      console.log('===receivedBytes===', receivedBytes);
      console.log('===totalBytes===', totalBytes);
      eventEmitter.emit(EVENT.application.updating_progress, {
        percent: Math.floor((receivedBytes * 10000) / totalBytes) / 100,
      });
    },
  );
};

export const CodePushService = {
  checkUpdateApp,
};

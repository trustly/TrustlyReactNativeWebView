import React from 'react';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';

export const NativeEventTypes = {
  SUCCESS: 'onTrustlyCheckoutSuccess',
  ERROR: 'onTrustlyCheckoutError',
  REDIRECT: 'onTrustlyCheckoutRedirect',
  ABORT: 'onTrustlyCheckoutAbort'
};
  
export const trustlyApplicationName = 'TrustlyReactNativeWebView/v1';
  
export const trustlyCustomBridge = `
  window.addEventListener('message', (e) => {
    try {
      const data = e.data;
      const message = typeof data !== 'string' ? JSON.stringify(data) : data;

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(message, '*');
      }
    } catch (e) {
      console.log('An error occurred while trying to handle message from Trustly SDK listener: ', e.message);
    }
  });

  /*
    NOTE: this is required, or you'll sometimes
    get silent failures
  */
  true;
`;

const onMessage = (data, onSuccess, onError, onAbort) => {
  try {
    const { type, url, eventType } = JSON.parse(data);

    const isCheckoutEvent = eventType === 'checkout-event';

    if (isCheckoutEvent) {
      if (type === NativeEventTypes.REDIRECT) {
        try {
          Linking.openURL(url);
        } catch (e) {
          console.log(`There was an error opening URL: ${url}. Error: ${e}`);
          onError();
        }
      }

      if (type === NativeEventTypes.ERROR) {
        onError();
      }

      if (type === NativeEventTypes.ABORT) {
        onAbort();
      }
      if (type === NativeEventTypes.SUCCESS) {
        onSuccess();
      }
    }
  } catch (e) {
    const error = typeof error === 'object' ? JSON.stringify(e) : e;
    console.error(
      `Something unexpected happen when trying to map Trustly Checkout events. Error: ${error}`
    );
  }
};

const TrustlyWebView = ({ uri, onSuccess, onError, onAbort }) => {
  return (
    <WebView
      source={{ uri }}
      injectedJavaScriptForMainFrameOnly={false}
      injectedJavaScript={trustlyCustomBridge}
      applicationNameForUserAgent={trustlyApplicationName}
      onMessage={({ nativeEvent }) => {
        try {
          onMessage(nativeEvent.data, onSuccess, onError, onAbort);
        } catch (e) {
          console.error(
            `Format of nativeEvent.data does not match Trustly API. Data sent: ${nativeEvent.data}`
          );
        }
      }}
    />
  );
};

export default TrustlyWebView;

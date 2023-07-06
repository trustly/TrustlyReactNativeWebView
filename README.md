# Trustly's ReactNative WebView Package

This package is meant to be integrated into React Native implementations of Trustly's Checkout. The package allows communication between Trustly's Checkout application and React Native's WebView through the `postMessage` method.

# Content

- [Trustly's ReactNative WebView Package](#trustlys-reactnative-webview-package)
- [Content](#content)
  - [Installation](#installation)
  - [Usage](#usage)

## Installation

```
npm i trustly-react-native-webview
```

## Usage

The Trustly React Native package exports a `WebView` component that can take three properties:

- `uri`: The Checkout URL that is returned from [Trustly's API](https://eu.developers.trustly.com/doc/reference/api-protocol)
- `onSuccess`: Optional function to be run as a callback when the order is done.
- `onError`: Optional function to be run as a callback if the order encounter any issues or if the order is aborted by the user.

The WebView component does not need to be modified and will start responding to events once added to your repository.

Example:

```
import TrustlyWebView from 'trustly-react-native-webview';

...

<TrustlyWebView uri={uri} onSuccess={onSuccess} onError={onError}/>
```

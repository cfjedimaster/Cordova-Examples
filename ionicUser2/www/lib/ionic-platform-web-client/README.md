# ionic-platform-web-client
A web client that provides interactions with the Ionic platform.
Check out our [docs](http://docs.ionic.io/docs/io-introduction) for more detailed information.


## Installation

Using the latest [Ionic CLI](https://github.com/driftyco/ionic-cli):

Run the following commands in terminal:

```bash
# first you need to install the web client
$ ionic add ionic-platform-web-client

# now you can register your app with the platform
$ ionic io init
```

## Usage

```javascript
// If no user has been previously saved, a fresh user object is returned,
// otherwise the last [current] saved user will be returned.
var user = Ionic.User.current();
```

Head over to our [docs](http://docs.ionic.io/docs/io-introduction) when you're ready to integrate services like analytics, push, or deploy.

## Get Help

Head over to our [gitter.im](http://gitter.im/driftyco/ionic-io-testers) channel if you require assistance or have any questions about the platform services. 

## Development

1. Install Dependencies `npm install`
2. Run `gulp build`

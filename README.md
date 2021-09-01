# Daycord
Daycord is a easy to use node module that will help you with your discord bot.

- Lightweight
- Easy to use
- Under development

## Installation
```
# NPM
npm install daycord

# Yarn
yarn add daycord
```

# How To Use

### Ratelimit
```js
const { Ratelimit } = require("daycord");
const rate = new Ratelimit();

rate.add("foo", 10000);

rate.get("foo");

rate.isRated("foo");

rate.remove("foo");
```

# License
This package is licenced under [Apache-2.0](LICENSE)

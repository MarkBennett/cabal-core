# cabal-core

Core database, replication, and chat APIs for cabal.

## Usage

    npm install --save cabal-core

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [Cabal](#cabal)
    -   [getUser](#getuser)
    -   [publish](#publish)
    -   [replicate](#replicate)
-   [Cabal#ready](#cabalready)
-   [Cabal#error](#cabalerror)

### Cabal

Create a new cabal. This is the object handling all
local nickname -> mesh interactions for a single user.

This fires a [#cabalready](#cabalready) event after the cabal has initialized,
a [#cabalerror](#cabalerror) event indicates that something has gone wrong.

**Parameters**

-   `storage` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))** A hyperdb compatible storage function, or a string representing the local data path.
-   `href` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The dat link, or a hostname with a DNS TXT entry of the form "CABALKEY=&lt;DAT_KEY_VALUE>". For example, "cabal://4ae5ec168a9f6b45b9d35e3cc1d0f4e3a436000d37fae8f53b3f8dadfe8f192f" is equivalent to "cabal.chat"
-   `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options include: username

#### getUser
Get information about a user that they've volunteered about themselves.

#### cabal.channels.read(cb)

**Parameters**

-   `key` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The hex key of the user.
-   `cb`  

#### publish

Publish a message to your feed.

**Parameters**

-   `message` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The message to publish.
-   `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options: date
-   `cb` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** When message has been successfully added.

#### replicate

Replication stream for the mesh.

### Cabal#ready

Ready event. Indicates the cabal db, key and view are initialized and ready to use.

Type: [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Cabal#error

Error. Indicates something went wrong initializing this cabal.

Type: [Error](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

<h1 align="center">Welcome to doseur 👋</h1>
<p>
[![Build Status](https://travis-ci.org/svlapin/doseur.svg?branch=master)](https://travis-ci.org/svlapin/doseur)

[![code coverage](https://codecov.io/gh/svlapin/doseur/branch/master/graph/badge.svg)](https://codecov.io/gh/svlapin/doseur)

[![npm version](https://badge.fury.io/js/doseur.svg)](https://badge.fury.io/js/doseur)

[![Known Vulnerabilities](https://snyk.io/test/github/svlapin/doseur/badge.svg)](https://snyk.io/test/github/svlapin/doseur)

[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

</p>

> Zero-dependency simple queue to run similar operations in batches

> Don't want to run db insert for each event generated in your application, but rather to insert them in batches? `doseur` them!

### 🏠 [Homepage](https:/github.com/svlapin/doseur#readme)

## Prerequisites

- node >=8.0.0

## Install

```sh
npm install doseur
```

## Usage

Default export of this package is a factory function that creates a `doseur` instance. As a rule of thumb, each instance is created to handle similar payloads.

`doseur` maintains an in-memory queue which is flushed (i.e. passed to a `fn` callback, see below) when queue outgrows specified size, or a timeout set with the first enqueued item fires.

`doseur` factory takes 3 mandatory arguments:

- `fn`: function which takes enqueued items as [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) and does something with them (e.g. sent to log stream, or insert to the database)
- `maxQueueLength`: maximum number of items to store in the queue. When number of enqueued items reaches `maxQueueLength`, queue is flushed.
- `timeoutMs`: maximum time (in ms) to wait before flushing the queue starting from the moment when first item is enqueued.

Result of calling `doseur` is an object with two methods:

- `enqueue`: takes an item to enqueue
- `reset`: resets current instance - empties the queue without calling `fn`, clears currently running timeout.

## Example

Here we use `doseur` to batch API events created by different request handlers and insert them into the database together.

Using the config options provided, each event is saved no longer than 10 seconds after it is created and each batch has no more than 10 items.

```js
const doseur = require('doseur');

const saveEventsBatch = (...events) => ApiEvent.insertMany(events);

const apiRequestQueue = doseur(saveEventsBatch, 10, 10000);

const withEventQueue = (req, res, next) => {
  req.apiRequestQueue = apiRequestQueue;
  next(null);
};

router.get('/api/todos', withEventQueue, (req, res) => {
  req.apiRequestQueue.enqueue({
    type: 'GetTodos',
    user: req.user.id
  });

  res.send([{ foo: 'bar' }]);
});

router.post('/api/todos', withEventQueue, (req, res) => {
  req.apiRequestQueue.enqueue({
    type: 'CreateTodo',
    user: req.user.id,
    body: req.body
  });

  res.send([{ foo: 'bar' }]);
});
```

## Run tests

```sh
npm run test
```

## Author

👤 **Sergey Lapin <sv0lapin@gmail.com>**

- Github: [@svlapin](https://github.com/svlapin)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https:/github.com/svlapin/doseur/issues).

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_

# bower-angular-localization

This repo is for distribution on `bower`. The source for this module is in the
[main AngularJS Localization repo](https://github.com/doshprompt/angular-localization).
Please file issues and pull requests against that repo.

## Install

Install with `bower`:

```shell
bower install angular-localization
```

Add a `<script>` to your `index.html`:

```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-cookies/angular-cookies.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
<script src="bower_components/angular-localization/angular-localization.js"></script>
```

Inject the dependency into your application module

```js
angular.module('myApp', ['ngLocalize']);
```

## Documentation

Documentation is available on the
[main AngularJS Localization repo](https://github.com/doshprompt/angular-localization).

## License

The MIT License (MIT)

Copyright (c) 2014 Rahul Doshi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

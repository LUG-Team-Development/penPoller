# penPoller

The Penultimate Poller, the poller to outpoll all pollers, but one (because there's always room for improvement) <sub>(also I love Monthy Python)</sub>

## Usage

Place the minified poller at the top of your script. Don't make any changes, <u>window.</u>penPoller means your changes can also affect other scripts.
Below an example of the most basic use. This polls for one HTML element and returns that element once it's been found.

```javascript
window.penPoller('button.primaryButton').then((button)=>{
	//do something with your button
});
```

You can also poll for multiple requirements of different types. Passing an array of requirements, returns an array of objects to use.

| Requirement type  | Format | Passing values | Returns | Notes |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| HTML selector  | `'button.primaryButton'` | `querySelector` returns an element or `querySelectorAll` returns at least one element | the element or an array of elements if options.all is set to true |
| window.object as string | `'window.someWindowObject.name'` or `'window.someWindowObject["name"]'` | Not undefined or false | the value of the object, in this case the value of `window.someWindowObject.name` | Runs through the whole window path in the string and prevents 'undefined'-errors. Don't use window.objects directly without stringifying, a function or a boolean. |
| function | `function(){ return someObject; }` | Not undefined or false | The returned value of the function, in this case the value of `someObject` |
| boolean | `someNumber >= 5` | True | True |

Example:

```javascript
let someNumber = 5;
let someObject = { 'name': 'test'}
window.someWindowObject = someObject;

let requirements = [
    'button.primaryButton',                 // HTML selector
    'window.someWindowObject.name',         // window.object as string
    someNumber === 5,                       // boolean
    function(){ return someObject; }        // function
];
window.penPoller(requirements).then(([button, name, someBoolean, someObject])=>{
	//do something with your returned values
});
```

## Options
You can pass several options that should help if you run into issues.

| Option  | Default value | Description |
| ------------- | ------------- | ------------- |
| scope  | `document` | this determines in which DOM element the poller looks for the required HTML element. For example, use a previously polled for element like `button`. Note: this only works for HTML elements, not for window.objects and other types. The poller does not poll for the scope, so make sure you poll for the element before you try to use it as scope in another poller. |
| all  | false  | this instructs the poller to use querySelectorAll, which returns an array of all elements that fit the selector. By default the poller uses querySelector and so returns only the first element that fits the selector. Note: this only works for HTML elements, not for window.objects and other types. |
| timeout | 5000 ms | in miliseconds, this is the maximum time the poller can check whether an element exists before it times out and returns nothing. |
| interval | 20 ms | in miliseconds, this is how quickly the poller renews its check of the requirements |

Example:

```javascript
let options = {
    scope: someElement,
    all: true,
    timeout: 10000,
    interval: 10
};
window.penPoller('button.primaryButton', options).then((buttons)=>{
    buttons.forEach((button)=>{
        //do something with every button
    });
});
```
or

```javascript
let options = {
    scope: someElement,
    all: true,
    timeout: 10000,
    interval: 10
};
let someNumber = 5;
let requirements = [
    'button.primaryButton',
    someNumber === 5
];
window.penPoller(requirements, options).then(([buttons, someBoolean])=>{
    buttons.forEach((button)=>{
        //do something with every button
    });
});
```

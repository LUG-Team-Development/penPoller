# penPoller

The Penultimate Poller, the poller to outpoll all pollers, but one (because there's always room for improvement)

## Usage

Place the minified poller at the top of your script.
Here an example of the most basic use. This polls for one element and returns that element once it's been found.

```javascript
penPoller('button.primaryButton').then((button)=>{
	//do something with your button
});
```

You can also poll for multiple elements of different types. Passing an array as requirement, returns an array of elements to use.

```javascript
let requiredElements = ['button.primaryButton', 'h3.title', 'window.userData', function(){ return something; }];
penPoller(requiredElements).then(([button, title, userData, something])=>{
	//do something with your button, title and userData
});
```

## Options
You can pass several options.

- scope: this determines where the poller looks for the required element, if left empty this defaults to `document`.
- all: this instructs the poller to use querySelectorAll, which returns an array of all elements that fit the selector. This applies to all requirements that return HTML elements, window.objects only return the one object. By default the poller uses querySelector and so returns only the first element that fits the selector.
- timeout: in miliseconds, this changes the maximum time the poller can check whether an element exists before it times out and returns nothing. Standard time is 5 seconds or 5000 miliseconds.
- interval: in miliseconds, this is how quickly the poller renews its search for the required elements. Standard setting is every 20 miliseconds.

```javascript
let options = {
  	scope: document.body,
    all: true,
  	interval: 10,
  	timeout: 10000
};
penPoller('button', options).then((buttons)=>{
    buttons.forEach((button)=>{
        //do something with every button
    });
});
```
or

```javascript
let options = {
  	scope: document.body,
    all: true,
  	timeout: 10000,
  	interval: 10
};
let requiredElements = ['button', 'window.userData'];
penPoller(requiredElements, options).then(([buttons, userData])=>{
    buttons.forEach((button)=>{
        //do something with every button and don't forget your userData
    });
});
```
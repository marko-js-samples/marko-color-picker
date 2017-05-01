# Color Picker Tutorial

## Introduction

Marko makes building UI components extremely easy and fun! Today we are going
to build a color picker component from scratch. We are going to learn how to:

- Create a project using [marko-devtools](https://github.com/marko-js/marko-devtools)
- Create a basic and customizable color picker component
- Write component tests using [marko-devtools](https://github.com/marko-js/marko-devtools)

Our final goal for today is create this component:

<p align="center">
  <img src="https://image.ibb.co/gcmLFk/color_picker_complete.png">
<p>

## Getting Started

[marko-devtools](https://github.com/marko-js/marko-devtools) comes packaged with
useful commands for building Marko projects. Projects created using
[marko-devtools](https://github.com/marko-js/marko-devtools) come bundled with
an HTTP server, and a build pipeline using [lasso](https://github.com/lasso-js/lasso)
making it very easy to get started.

Let's first install [marko-devtools](https://github.com/marko-js/marko-devtools)
globally, so we can create our project:

Using `npm`:

```bash
npm install -g marko-devtools
```

Using `yarn`:

```bash
yarn global add marko-devtools
```

Now we are ready to create our Marko project:

```bash
# Creates a `color-picker-tutorial` project in the current directory
marko create color-picker-tutorial
```

Let's navigate to the newly created project and install the necessary
dependencies:

```bash
cd color-picker-tutorial
npm install # Or `yarn`
```

We can now start our demo project and navigate to
[localhost:8080](http://localhost:8080) to ensure that everything is working
properly:

```bash
# Start the project!
npm start
```

## Creating Components

> NOTE: For a more detailed documentation of components, please see the
> [markojs.com components documentation](http://markojs.com/docs/components/)

In our new project, components are located in the `color-picker-tutorial/components/`
directory. Next we need to create our component in the `components/` directory,
which should look like this:

```
color-picker-tutorial/
  components/
    color-picker/
      index.marko
```

Marko also supports creating components using the file name. For example, the
following is a valid directory structure:

```
color-picker-tutorial/
  components/
    color-picker.marko
    color-picker.component.js
    color-picker.style.css
```

Creating nested component directories is not required. **We recommend** isolating
most components in their own directories. Many components will contain additional
files and tests that live alongside the component. Too many components living
in a single directory will become very untidy and difficult to manage.

Let's begin by adding some initial component code to the `color-picker`.

**components/color-picker/index.marko**
```marko
class {
    onInput(input) {
        input.colors = input.colors || [
            'red',
            'green',
            'blue',
            'orange',
            'yellow'
        ];

        this.state = {
            backgroundColor: input.colors[0]
        };
    }
}

<ul>
    <for(color in input.colors)>
        <li style={color: color}>
            ${color}
        </li>
    </for>
</ul>
```

`input` in a Marko component is the data that is passed to the component when
it is being initialized. Let's modify our `index` route to demonstrate how a
parent component can use our `color-picker`:

**routes/index/index.marko**
```marko
<html>
  <head>
    <title>Welcome | Marko Demo</title>
  </head>
  <body>
    <h1>Welcome to Marko!</h1>
    <color-picker colors=[
      '#333745',
      '#E63462',
      '#FE5F55',
      '#C7EFCF',
      '#EEF5DB',
      '#00B4A6',
      '#007DB6',
      '#FFE972',
      '#9C7671',
      '#0C192B'
    ]/>
  </body>
</html>
```

Navigating to [localhost:8080](http://localhost:8080) should show us an
unordered list with list items for each of the colors that we passed as `input`
to our component. If a `colors` attribute is not passed to the component as
`input`, our component automatically falls back to a default set of colors:

```marko
<!-- Colors default to red, green, blue, orange, yellow -->
<color-picker/>
```

<p align="center">
  <img src="https://image.ibb.co/dQdCd5/Screenshot_from_2017_04_27_07_38_23.png">
</p>

### Child Components

We've created our first component! This component will act as the entry point
for children components that we will create. When creating components, it's
strongly recommended to consider how components can be broken down into
multiple components. Each component can then be independently tested and managed.

Let's split our component into the following components:

- `<color-picker-header>`: The header will have the selected background color
from the color picker and show the selected color's hex value

<p align="center">
  <img src="https://image.ibb.co/kybsT5/color_picker_header.png">
</p>

- `<color-picker-footer>`: The footer will contain a pallete of colors and an
input field for changing the hex value of the header

<p align="center">
  <img src="https://image.ibb.co/kjiT1Q/color_picker_footer.png">
</p>

`<color-picker-selection>`: The selection component is responsible for
displaying an individual color box and the associated click events

<p align="center">
  <img src="https://image.ibb.co/nRvxvk/color_picker_selection.png">
</p>


Marko automatically registers all components in a nested `components/`
directories. Our new directory structure should look like this:

```
components/
  color-picker/
    components/
      color-picker-footer/
        index.marko
      color-picker-header/
        index.marko
      color-picker-selection/
        index.marko
    index.marko
```

The `color-picker` component should now have access to all of the child
components that we just created, and we can develop them all independently.

Let's start with with the `<color-picker-header>` component. We've already
determined that the header should have a specific background color and display
the value of that background color in text. Since the background color is
subject to changing its value, it should be part of the `state`. An initial
background color should be allowed to be passed, so that will be part of the
component's input.

**components/color-picker/components/color-picker-header/index.marko**
```marko
class {
  onInput(input) {
    // Set the current component state based on the background color passed
    // to the component as `input` or fall back to a default color.
    this.state = {
      backgroundColor: input.backgroundColor || 'red'
    };
  }
}

// In Marko, we immediately start writing a single line of JavaScript by using
// `$`. For multi-line JavaScript, use `$ { /* JavaScript here */ }
$ var backgroundColor = state.backgroundColor;

// Inline styles!
style {
  .color-picker-header {
    width: 200px;
    height: 100px;
    border-radius: 20px 20px 0 0;
    font: 30px Arial;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: white;
  }
  .color-picker-header > p {
    margin-top: 1.15em;
  }
}

<!-- Our markup! -->
<div.color-picker-header style={backgroundColor}>
  <p>${backgroundColor}</p>
</div>
```

That's it! Our `<color-picker-header>` is complete with styles and component
logic. This component is small enough to be contained in a single file, but
as components grow larger, we should split out the markup, component logic, and
styling. We will see an example of this soon.

Now let's look at what's going on. Marko has several
[lifecycle methods](http://markojs.com/docs/components/#lifecycle) including
`onInput`, which contains a single parameter `input`. As we discussed before
`input` is the data that is passed to a Marko component upon initialization.
We can use inline javascript easily with `$` or `$ { /* ... */ }` for blocks,
which is great for creating variables that can be accessed inside of your
template. Additionally, single file components support inline styles, so the
component can truly be contained as a single unit if it's small enough.

Now we need to revist our parent component and add the `<color-picker-header>`
tag to it, so it will be rendered.

**components/color-picker/index.marko**
```marko
class {
  onInput(input) {
    input.colors = input.colors || [
      'red',
      'green',
      'blue',
      'orange',
      'yellow'
    ];

    this.state = {
      backgroundColor: input.colors[0]
    };
  }
}

<color-picker-header backgroundColor=state.backgroundColor/>
```

Navigating to [localhost:8080](http://localhost:8080), we should see the
rendered `<color-picker-header>` with a red background like so:

<p align="center">
  <img src="https://image.ibb.co/gpccBQ/Screenshot_from_2017_04_27_07_35_58.png">
</p>

Now let's create the `<color-picker-selection>` component, which will be used
inside of the `<color-picker-footer>`:

**components/color-picker/components/color-picker-selection/index.marko**
```marko
class {
  onInput(input) {
    input.backgroundColor = input.backgroundColor || 'green';
  }
  onColorSelected() {
    this.emit('colorSelected', this.input.backgroundColor);
  }
}

style {
  .color-picker-selection {
    width: 25px;
    height: 25px;
    border-radius: 5px 5px 5px 5px;
    display: flex;
    flex-direction: column;
    margin: 5px 0px 0px 5px;
    float: left;
  }
}

<div.color-picker-selection on-click('onColorSelected') style={
  backgroundColor: input.backgroundColor
}></div>
```

In this component, we've introduced an `on-click` listener and handler function.
[Marko components inherit from EventEmitter](http://markojs.com/docs/components/#events).
When this color is selected, it will emit an event and get handled by the
`onColorSelected` function. The handler then emits a `colorSelected` event
with the background color to be handled by its parent. We will eventually
relay this information back to the `<color-picker-header>`, so its background
color and text can be changed.

We are ready to create our final component, `<color-picker-footer>`. This
component is going to contain a bit more logic than the other components, so
let's split it out into multiple files:

```
components/
  color-picker/
    components/
      color-picker-footer/
        component.js
        index.marko
        style.css
      ...
    ...
```

**components/color-picker/components/color-picker-footer/index.marko**
```marko
$ var colors = input.colors;

<div.color-picker-footer>
  <div.color-picker-selection-container>
    <div for(color in colors)>
      <!--
      Listen for the `colorSelected` event emitted from
      the <color-picker-selection> component and handle
      it in this component's `onColorSelected` method.
      -->
      <color-picker-selection backgroundColor=color on-colorSelected('onColorSelected')/>
    </div>
    <input
      key="hexInput"
      placeholder="Hex value"
      on-input('onHexInput')/>
  </div>
</div>
```

In the `<color-picker-footer>` component we need to iterate over each color
that was passed as input in `colors`. For each color, we create a
`<color-picker-selection>` component and pass the `color` as the value for
`backgroundColor`. Additionally, we are listening for the `colorSelected` event
emitted from the `<color-picker-selection>` component and handling it in our
own `onColorSelected` method. We also have added an `input` field and an
`on-input` listener, which will be used to manually change the
background color of the `<color-picker-header>` to a color that is not in
the palette.

**components/color-picker/components/color-picker-footer/component.js**
```marko
function isValidHexValue (hexValue) {
  return /^#[0-9A-F]{6}$/i.test(hexValue);
}

module.exports = {
  onInput (input) {
    input.colors = input.colors || ['red', 'green', 'blue'];
  },
  onColorSelected (backgroundColor) {
    this.emit('colorSelected', backgroundColor);
  },
  onHexInput () {
    let hexInput = this.getEl('hexInput').value;

    if (!hexInput.startsWith('#')) {
      hexInput = '#' + hexInput;
    }

    if (!isValidHexValue(hexInput)) {
      hexInput = this.input.colors[0];
    }

    this.emit('colorSelected', hexInput);
  }
};
```

When the component logic is split out from the `index.marko` it needs to be
exported like a standard JavaScript module. We have an `onColorSelected`
event handler, which is working to bubble the event back up to eventually
reach the `<color-picker-header>`. We also have an `onHexInput` event handler
with some basic validation logic. `onHexInput` also emits `colorSelected`, which
will be handled the same way as the `colorSelected` event when it reaches
`<color-picker-header>`.

**components/color-picker/components/color-picker-footer/style.css**
```css
.color-picker-footer {
  width: 200px;
  height: 100px;
  border-radius: 0px 0px 20px 20px;
  font: 30px Arial;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: white;
  box-shadow: 0px 3px 5px #888888;
}
.color-picker-selection-container {
  width: 75%;
  margin: 5px 0px 0px 20px;
}
.color-picker-selection-container input {
  margin-top: 8px;
  border-radius: 0px 0px 0px 0px;
  border-width: 0px 0px 1px 0px;
  outline: none;
  color: #A9A9A9;
}
```

We can now wrap up our component! Let's revisit the parent `<color-picker>`
component and add the `<color-picker-footer>`:

**components/color-picker/index.marko**
```marko
class {
  onInput(input) {
    input.colors = input.colors || [
      'red',
      'green',
      'blue',
      'orange',
      'yellow'
    ];

    this.state = {
      backgroundColor: input.colors[0]
    };
  }

  onColorSelected(backgroundColor) {
    // Handler for the event that bubbled up from the <color-picker-footer>
    // We set the background color state and rerender the component. This
    // will cause the <color-picker-header> background color to change.
    this.state.backgroundColor = backgroundColor;
  }
}

<color-picker-header backgroundColor=state.backgroundColor/>
<color-picker-footer colors=input.colors on-colorSelected('onColorSelected')/>
```

Finally, we've added our `<color-picker-footer>`, passed the `input.colors`
as `input` to it, added a `onColorSelected` event handler for the `colorSelected`
event emitted from `<color-picker-footer>`. When we handle this event, we
update the `state` of the `<color-picker>` component, which is passed to
the `<color-picker-header>`.

Our final result:

<p align="center">
  <img src="https://image.ibb.co/gcmLFk/color_picker_complete.png">
<p>

## Testing

`marko-devtools` comes packaged with testing frameworking built on top of
[mocha](https://mochajs.org/) We can easily add tests for our components, by
adding a `test.js` inside the directory of the component. First let's add a test
assertion library [chai](http://chaijs.com/):

```bash
npm install chai --save-dev
```

Now we can add a simple test to any component. Here's a demonstration of a test
for the `<color-picker-header>`:

**components/color-picker/components/color-picker-header/test.js**
```javascript
/* global test */
const expect = require('chai').expect;

test('color-picker-header color', function (context) {
  const output = context.render({
    backgroundColor: '#000000'
  });

  expect(output.$('div').attr('style')).to.contain('background-color:#000000');
});

test('color-picker-header default color', function (context) {
  const output = context.render();
  expect(output.$('div').attr('style')).to.contain('background-color:#ff0000');
});
```

Let's add a `test` script to our `package.json`:

```json
{
  "scripts": {
    "start": "marko-starter server",
    "build": "marko-starter build",
    "test": "marko test"
  }
}
```

Now we can run our tests:

```bash
npm test
```

More information about Marko component testing can be found in the
[marko-devtools component testing](https://github.com/marko-js/marko-devtools#component-testing)
documentation.

## Conclusion

Developing complicated Marko components is fun and easy! As you're developing
components, you should consider how a component can be split into multiple
components. This makes developing, managing, and testing components
significantly easier.

Marko gives you the tools to easily develop awesome UI components. Get started
today!

## Additional Resources

- [marko-color-picker](https://github.com/marko-js-samples/marko-color-picker)
- [marko color picker try-online](http://markojs.com/try-online/?file=%2Fcolor-picker%2Findex.marko&gist=)
- [marko-devtools](https://github.com/marko-js/marko-devtools)



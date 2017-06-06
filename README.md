# Building a Color Picker Component

## Introduction

Marko makes building UI components extremely easy and fun! Today we are going
to build a color picker component from scratch. We are going to learn how to:

- Create a project using [marko-devtools](https://github.com/marko-js/marko-devtools)
- Create a basic and customizable color picker component
- Write component tests using [marko-devtools](https://github.com/marko-js/marko-devtools)

Our final goal for today is create this component:

<!-- <color-picker colors=['#333745','#E63462','#FE5F55','#C7EFCF','#EEF5DB','#00B4A6','#007DB6','#FFE972','#9C7671','#0C192B']/>() -->
<p align="center">
  <img src="https://image.ibb.co/gcmLFk/color_picker_complete.png">
</p>
<!-- </> -->

[Try Online: marko-color-picker](http://markojs.com/try-online/?file=%2Fcolor-picker%2Findex.marko)

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
```

Creating nested component directories is not required, but we recommend
isolating most components in their own directories. Many components will contain
additional files and tests that live alongside the component. Too many components
living in a single directory will become very untidy and difficult to manage.

Let's begin by adding some initial component code to the `color-picker`.

**components/color-picker/index.marko**
```marko
<ul>
  <for(color in input.colors)>
    <li style={color: color}>
      ${color}
    </li>
  </for>
</ul>
```

`input` in a Marko component is the input data that is passed to the component when
it is being rendered. Let's modify our `index` route to demonstrate how a
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
to our component.

<!-- <color-list colors=['#333745','#E63462','#FE5F55','#C7EFCF','#EEF5DB','#00B4A6','#007DB6','#FFE972','#9C7671','#0C192B']/>() -->
<p align="center">
  <img src="https://user-images.githubusercontent.com/3771924/26837085-83315144-4aaa-11e7-8a08-2863a6448134.png">
</p>
<!-- </> -->

### Child Components

We've created our first component! This component will eventually have nested
components. When creating components, it's
strongly recommended to consider how components can be broken down into
multiple components. Each component can then be independently developed and tested.

Let's split our component into the following components:

- `<color-picker-header>`: The header will have the selected background color
from the color picker and show the selected color's hex value

<!-- <color-picker-header color='#333745'/>() -->
<p align="center">
  <img src="https://image.ibb.co/kybsT5/color_picker_header.png">
</p>
<!-- </> -->

- `<color-picker-footer>`: The footer will contain a palette of colors and an
input field for changing the hex value of the header

<!-- <color-picker-footer colors=['#333745','#E63462','#FE5F55','#C7EFCF','#EEF5DB','#00B4A6','#007DB6','#FFE972','#9C7671','#0C192B']/>() -->
<p align="center">
  <img src="https://image.ibb.co/kjiT1Q/color_picker_footer.png">
</p>
<!-- </> -->

`<color-picker-selection>`: The selection component is responsible for
displaying an individual color box and handling the associated click events

<!-- <color-picker-selection color='#333745'/>() -->
<p align="center">
  <img src="https://image.ibb.co/nRvxvk/color_picker_selection.png">
</p>
<!-- </> -->

Marko automatically registers all components in nested `components/`
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
the value of that background color in text. The color to display should be passed in as part of the input.

**components/color-picker/components/color-picker-header/index.marko**
```marko
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
    padding-top: 1.15em;
  }
}

// In Marko, we immediately start writing a single JavaScript statement by using
// `$`. For multiple JavaScript statements, use `$ { /* JavaScript here */ }
$ var color = input.color;

<!-- Our markup! -->
<div.color-picker-header style={backgroundColor: color}>
  <p>${color}</p>
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
We can use inline javascript easily with `$` (for a single statement) or `$ { /* ... */ }` (for multiple statements),
which is great for creating variables that can be accessed inside of your
template. Additionally, single file components support inline styles, so the
component can truly be contained as a single unit if it's small enough.

Now we need to revisit our parent component and add the `<color-picker-header>`
tag to it, so it will be rendered.

**components/color-picker/index.marko**
```marko
import getColors from './util/getColors';

class {
  onInput(input) {
    var colors = input.colors || getColors();

    this.state = {
      selectedColor: colors[0],
      colors
    };
  }

  onColorSelected(color) {
    this.state.selectedColor = color;
  }
}

<div>
  <color-picker-header color=state.selectedColor/>
</div>
```

Marko will automatically watch the `state` object for changes using getters and setters, and if the state changes then the UI component will be re-rendered and the DOM will automatically be updated.

Navigating to [localhost:8080](http://localhost:8080), we should see the
rendered `<color-picker-header>` with a gray background like so:

<!-- <color-picker-header color='#333745'/>() -->
<p align="center">
  <img src="https://image.ibb.co/kybsT5/color_picker_header.png">
</p>
<!-- </> -->

Now let's create the `<color-picker-selection>` component, which will be used
inside of the `<color-picker-footer>`:

**components/color-picker/components/color-picker-selection/index.marko**
```marko
class {
  onColorSelected() {
    this.emit('colorSelected');
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

<div.color-picker-selection
  on-click('onColorSelected')
  style={
    backgroundColor: input.color
  }/>
```

In this component, we've introduced an `on-click` listener and handler function.
[Marko components inherit from EventEmitter](http://markojs.com/docs/components/#events).
When this color is selected, it will emit an event and get handled by the
`onColorSelected` function. The handler then emits a `colorSelected` event to be handled by its parent. We will eventually write code to relay this information back to the `<color-picker-header>`, so its background
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
      Listen for the `colorSelected` event emitted from the
      <color-picker-selection> component and handle it in this
      component's `onColorSelected` method.
      NOTE: We pass along the `color` to the event handler method
      -->
      <color-picker-selection
        color=color
        on-colorSelected('onColorSelected', color)/>
    </div>
    <input
      key="hexInput"
      placeholder="Hex value"
      on-input('onHexInput')/>
  </div>
</div>
```

In the `<color-picker-footer>` component we need to iterate over each color that was passed as input in `colors`. For each color, we create a `<color-picker-selection>` component and pass the color using the `color` attribute. Additionally, we are listening for the `colorSelected` event emitted from the `<color-picker-selection>` component and handling it in our own `onColorSelected` method. We provide the `color` as the second argument so that it will be available to the event handler method. We also have added an `input` field and a `on-input` listener, which will trigger a change to the selected color when the user manually enters a hex color value.

**components/color-picker/components/color-picker-footer/component.js**
```javascript
function isValidHexValue (hexValue) {
  return /^#[0-9A-F]{6}$/i.test(hexValue);
}

module.exports = class {
  onColorSelected (color) {
    this.emit('colorSelected', color);
  }
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
event handler, which is going to emit the event back up to the parent `<color-picker-header>` component. We also have an `onHexInput` event handler
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

We can now finalize our component! Let's revisit the parent `<color-picker>`
component and add the `<color-picker-footer>`:

**components/color-picker/index.marko**
```marko
class {
  onInput(input) {
    var colors = input.colors;

    this.state = {
      selectedColor: colors[0],
      colors
    };
  }

  onColorSelected(color) {
    this.state.selectedColor = color;
  }
}

<div>
  <color-picker-header color=state.selectedColor/>
  <color-picker-footer colors=state.colors on-colorSelected('onColorSelected')/>
</div>
```

Finally, we've added our `<color-picker-footer>`, passed the `state.colors`
as `input` to it, added a `onColorSelected` event handler for the `colorSelected`
event emitted from `<color-picker-footer>`. When we handle this event, we
update the `state` of the `<color-picker>` component, which is passed to
the `<color-picker-header>`.

Congratulations! You have finished your first fully reactive Marko UI component!

Our finished product:

<!-- <color-picker colors=['#333745','#E63462','#FE5F55','#C7EFCF','#EEF5DB','#00B4A6','#007DB6','#FFE972','#9C7671','#0C192B']/>() -->
<p align="center">
  <img src="https://image.ibb.co/gcmLFk/color_picker_complete.png">
</p>
<!-- </> -->

--------------

Now let's talk about some additional topics that will turn you into a Marko pro!

## Importing Modules

Marko also supports importing modules. We can easily import a module using
the familiar ES2015 `import` syntax for single file components.
Let's fetch the default `<color-picker>` colors from an external module:

```bash
npm install flat-colors --save
```

Let's create a new helper module for generating colors:

**components/color-picker/util/getColors.js**
```js
const flatColors = require('flat-colors').colors;

const HEX_INDEX = 3;

module.exports = function getColors () {
  let colors = [];
  for (let i = 0; i < 10; i++) {
    colors.push(flatColors[i][HEX_INDEX]);
  }
  return colors;
};
```

We can import our helper module into the `color-picker` and use the generated
colors as the default when none are passed as part of the `input`:

**components/color-picker/index.marko**
```marko
import getColors from './util/getColors';

class {
  onInput(input) {
    var colors = input.colors || getColors();

    this.state = {
      selectedColor: colors[0],
      colors
    };
  }

  onColorSelected(color) {
    this.state.selectedColor = color;
  }
}

<div>
  <color-picker-header color=state.selectedColor/>
  <color-picker-footer colors=state.colors on-colorSelected('onColorSelected')/>
</div>
```

Now, if we do not pass `colors` to the `<color-picker>`, the colors will default
to the colors obtained from `flat-colors`:

<!-- <color-picker/>() -->
<p align="center">
  <img src="http://image.ibb.co/k9pYLv/Screen_Shot_2017_06_05_at_5_08_55_PM.png">
</p>
<!-- </> -->

[Try Online: marko-color-picker](http://markojs.com/try-online/?file=%2Fcolor-picker%2Findex.marko)

## Routing

Routes can be specified by creating subdirectories under the `routes/` folder.
The `routes/index` route is automatically registered as the index of the
application. In a route directory, an `index.marko` or a `route.js` that
exports a `handler` method may be created. [marko-starter](https://github.com/marko-js/marko-starter)
is the underlying project that handles the routing, and automatically resolves routes from the `routes/` folder. See the
[marko-starter route documentation](https://github.com/marko-js/marko-starter#adding-pages)
for more information.

Alternatively, having an `index.marko` file in the root directory of your project (e.g. `/marko-color-picker/index.marko`), will automatically get served as the index route's template.

## Testing

`marko-devtools` comes packaged with testing frameworking built on top of
[mocha](https://mochajs.org/). We can easily add tests for our components, by
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
    color: '#000000'
  });

  expect(output.$('div').attr('style')).to.contain('background-color:#000000');
});

test('color-picker-header default color', function (context) {
  const output = context.render();
  expect(output.$('div').attr('style')).to.contain('background-color:#333745');
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

Developing Marko UI components is fun and easy! As you're developing
components, you should consider how a component can be split into multiple
components. This makes developing, managing, and testing components
significantly easier.

Marko gives you the tools to easily develop awesome UI components. Get started
today!

## Additional Resources

- [marko-color-picker](https://github.com/marko-js-samples/marko-color-picker)
- [Try Online: marko-color-picker](http://markojs.com/try-online/?file=%2Fcolor-picker%2Findex.marko)
- [marko-devtools](https://github.com/marko-js/marko-devtools)

--------------

> Special thanks to [Anthony Ng](https://github.com/newyork-anthonyng) for helping with this tutorial!

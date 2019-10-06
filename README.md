# Building a Color Picker Component

<img width="100%" src="https://user-images.githubusercontent.com/3771924/26844826-b2334098-4ac2-11e7-81ac-ca2280ef3bbd.png" alt="">

## Introduction

Marko makes building UI components easy and fun! We’ll build a color picker component from scratch, learning how to:

- Create a basic and customizable color picker component
- Start a project with [Marko’s command-line interface](https://github.com/marko-js/marko-cli)
- Write component tests with the same CLI

Our final goal is this component:

<!-- <color-picker colors=['#333745','#e63462','#fe5f55','#c7efcf','#eef5db','#00b4a6','#007db6','#ffe972','#9c7671','#0c192b']/>() -->
<img src="https://image.ibb.co/gcmLFk/color_picker_complete.png" alt="The complete color picker shows the current color and its hex value, a palette of selectable colors, and a text input for a custom hex code.">
<!-- </> -->

[Try the finished color picker online!](https://markojs.com/try-online/?file=%2Fmarko-color-picker%2Findex.marko)

## Getting Started

[`marko-cli`](https://github.com/marko-js/marko-cli) has useful commands for building Marko projects. Projects created with `marko-cli` come bundled with an HTTP server and a [lasso](https://github.com/lasso-js/lasso) build pipeline, making it easy to get started.

First, globally install `marko-cli` so we can create our project.

Using `npm`:

```bash
npm install --global marko-cli
```

Using `yarn`:

```bash
yarn global add marko-cli
```

Now we are ready to create our Marko project:

```bash
# Creates a `color-picker-tutorial` project in the current directory
marko create color-picker-tutorial
```

Let’s navigate to the newly created project and install its dependencies:

```bash
cd color-picker-tutorial
npm install # Or `yarn`
```

We can now start our demo project:

```bash
# Start the project!
npm start
```

…then navigate to [`localhost:8080`](http://localhost:8080) to ensure that everything works.

## Creating Components

> **NOTE:** For detailed documentation of components, please see the [Marko components documentation](https://markojs.com/docs/class-components/).

In our new project, components are saved in the `color-picker-tutorial/components/` directory. We need to create our component in that directory, which should look like this:

```
color-picker-tutorial/
  components/
    color-picker/
      index.marko
```

Marko also supports creating components using the filename. The following is also supported:

```
color-picker-tutorial/
  components/
    color-picker.marko
```

Creating nested component directories is not required, but we recommend isolating most components in their own directories. Many components need tests and additional files that live alongside them, and too many components in one directory are untidy and difficult to manage.

Let’s begin by adding an initial template for `color-picker`:

**`components/color-picker/index.marko`**
```marko
<ul>
  <for|color| of=input.colors>
    <li style={color: color}>
      ${color}
    </li>
  </for>
</ul>
```

`input` in a Marko component contains the data that is passed to the component when it renders. Let’s modify our `index` route to demonstrate how a parent component can use our `<color-picker>`:

**`routes/index/index.marko`**
```marko
<!doctype html>
<html lang="en">
  <head>
    <title>Welcome | Marko Demo</title>
  </head>
  <body>
    <h1>Welcome to Marko!</h1>
    <color-picker colors=[
      '#333745',
      '#e63462',
      '#fe5f55',
      '#c7efcf',
      '#eef5db',
      '#00b4a6',
      '#007db6',
      '#ffe972',
      '#9c7671',
      '#0c192b'
    ]/>
  </body>
</html>
```

Navigating to [`localhost:8080`](http://localhost:8080) should show an unordered list of the colors we passed as `input` to `<color-picker>`.

<!-- <color-list colors=['#333745','#e63462','#fe5f55','#c7efcf','#eef5db','#00b4a6','#007db6','#ffe972','#9c7671','#0c192b']/>() -->
  <img src="https://user-images.githubusercontent.com/3771924/26837085-83315144-4aaa-11e7-8a08-2863a6448134.png" alt="A bulleted list of hex codes. Each list item is colored with its hex code’s color.">
<!-- </> -->

### Child Components

We’ve created our first component! This component will eventually nest components inside it. 

Why? When creating components, it’s strongly recommended to consider how to break them down into multiple subcomponents. Each component can then be independently developed and tested.

Let’s split our color picker into the following components:

- `<color-picker-header>`: Displays the selected color and its hex code

  <!-- <color-picker-header color='#333745'/>() -->
  <img src="https://image.ibb.co/kybsT5/color_picker_header.png" alt="The upper half is a rounded card with a dark gray background, tinged slightly blue. The hex code for it reads “#333745”.">
  <!-- </> -->

- `<color-picker-footer>`: Contains a palette of colors and a text input for changing the hex value of the header.

  <!-- <color-picker-footer colors=['#333745','#e63462','#FE5F55','#C7EFCF','#EEF5DB','#00B4A6','#007DB6','#FFE972','#9C7671','#0C192B']/>() -->
  <img src="https://image.ibb.co/kjiT1Q/color_picker_footer.png" alt="The lower half is a palette of 10 sample colors, and a field reading “hex value”.">
  <!-- </> -->

- `<color-picker-selection>`: Displays an individual color box in the palette, and handles its associated click events.

  <!-- <color-picker-selection color='#333745'/>() -->
  <img src="https://image.ibb.co/nRvxvk/color_picker_selection.png" alt="A small rounded box containing a color.">
  <!-- </> -->

Marko automatically registers all components in nested `components/` directories. Our new directory structure should look like this:

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

The `color-picker` component now has access to the child components that we just created, and we can develop them all independently.

Let’s start with with the `<color-picker-header>` component. We’ve already decided that the header should have a specific background color, and display its hex code in text. The color it displays should be passed as part of the input.

**`components/color-picker/components/color-picker-header/index.marko`**
```marko
style {
  .color-picker-header {
    width: 12.5rem;
    height: 6.25rem;
    border-radius: 1.25rem 1.25rem 0 0;
    font: 1.875rem Arial, sans-serif;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: white;
  }
  .color-picker-header-code {
    margin: 1.15em 0 0;
  }
}

// In Marko, we start a single JavaScript statement with `$`.
// For multiple JavaScript statements, use `$ { /* JavaScript here */ }`
$ const { color } = input;

<!-- Our markup! -->
<header.color-picker-header style={backgroundColor: color}>
  <p.color-picker-header-code>${color}</p>
</header>
```

Our `<color-picker-header>` is now complete with styles and component logic. This component is small enough to be contained in a single file, but as components grow larger, we should split out the markup, component logic, and styling. We will see an example of this soon.

Now let’s look at what's going on. Marko has several [lifecycle methods](https://markojs.com/docs/class-components/#lifecycle-events) for components. One of them is `onInput`, which takes a single parameter: `input`.

As we discussed before, `input` is the data passed to a Marko component upon initialization. We can use inline JavaScript with `$` for a single statement, or `$ { /* … */ }` for multiple statements, which is great for creating variables to access inside your template.

Additionally, single-file components support inline `style` blocks, so the component can be contained as a single unit if it’s small enough.

Now we need to revisit our parent component and add the `<color-picker-header>` tag to it, so it will be rendered.

**`components/color-picker/index.marko`**
```marko
class {
  onInput(input) {
    const { colors } = input;

    this.state = {
      selectedColor: colors[0],
      colors
    };
  }
}

<color-picker-header color=state.selectedColor/>
```

Marko will automatically watch the `state` object for changes — if it does change, then the UI component will rerender and the DOM will automatically be updated.

Navigating to [`localhost:8080`](http://localhost:8080), we should see the rendered `<color-picker-header>` with a gray background, like so:

<!-- <color-picker-header color='#333745'/>() -->
<img src="https://image.ibb.co/kybsT5/color_picker_header.png" alt="The code “#333745” sitting in a field of gray.">
<!-- </> -->

Now let’s create the `<color-picker-selection>` component, to use inside `<color-picker-footer>`:

**`components/color-picker/components/color-picker-selection/index.marko`**
```marko
class {
  handleColorSelected(event) {
    event.preventDefault();
    this.emit('color-selected');
  }
}

style {
  .color-picker-selection {
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 5px;
    overflow: hidden;
    margin: 5px 0 0 5px;
    padding: 0;
    border: 0;
  }
}

<input.color-picker-selection
  on-click('handleColorSelected')
  value=input.color
/>
```

In this component, we've introduced an `on-click` listener and its corresponding handler method.

When this color is selected, it will emit a `click` event that gets handled by the `handleColorSelected` method. The handler then emits a `'color-selected'` event to its parent. We will eventually write code to relay this information to the `<color-picker-header>`, so its background color and text can be changed.

We are ready to create our final component: `<color-picker-footer>`. This component is going to contain a bit more logic than the other components, so let’s split it into multiple files:

```
components/
  color-picker/
    components/
      color-picker-footer/
        component.js
        index.marko
        style.css
```

**`components/color-picker/components/color-picker-footer/index.marko`**
```marko
$ const { colors } = input;

<div.color-picker-footer>
  <div.color-picker-selection-container>
    <for(color in colors)>
      <!-- Listen for the `color-selected` event from
      <color-picker-selection>, and handle it in this
      component’s `handleColorSelected` method.
      NOTE: We pass along the `color` to the event handler method
      -->
      <color-picker-selection
        color=color
        on-color-selected('handleColorSelected', color)/>
    </for>
    <input
      key="hexInput"
      placeholder="Hex value"
      title="Hex value"
      on-input('handleHexInput')/>
  </div>
</div>
```

In the `<color-picker-footer>` component we need to iterate over each color that was passed as input in `colors`. For each color, we create a `<color-picker-selection>` component and pass the color using the `color` attribute. Additionally, we are listening for the `color-selected` event emitted from the `<color-picker-selection>` component and handling it in our own `handleColorSelected` method. We provide the `color` as the second argument so that it will be available to the event handler method. We also have added an `input` field and a `on-input` listener, which will trigger a change to the selected color when the user manually enters a hex value.

**`components/color-picker/components/color-picker-footer/component.js`**
```js
export default class {
  handleColorSelected (color) {
    this.emit('color-selected', color);
  }
  
  handleHexInput () {
    let hexInput = this.getEl('hexInput').value.trim();

    if (!hexInput.startsWith('#')) {
      hexInput = `#${hexInput}`;
    }

    if (isValidHexValue(hexInput)) {
      this.emit('colorSelected', hexInput);
    }
  }
}

function isValidHexValue (hexValue) {
  return /^#[\dA-F]{6}$/i.test(hexValue);
}
```

When the component logic is split out from the `index.marko`, it must be `export`ed like a standard JavaScript module.

We have an `handleColorSelected` event handler, which will emit the event back up to the parent `<color-picker-header>`. We also have an `handleHexInput` event handler with some validation logic. `handleHexInput` also emits `color-selected`, which will be handled the same way as the `color-selected` event when it reaches `<color-picker-header>`.

**`components/color-picker/components/color-picker-footer/style.css`**
```css
.color-picker-footer {
  width: 200px;
  height: 100px;
  border-radius: 0 0 20px 20px;
  font: 30px Arial, sans-serif;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: white;
  box-shadow: 0 3px 5px #888;
}
.color-picker-selection-container {
  width: 75%;
  margin: 5px 0 0 20px;
}
.color-picker-selection-container input {
  margin-top: 8px;
  border-radius: 0;
  border-width: 0 0 1px;
  color: #a9a9a9;
}
```

We can now finalize our component! Let’s revisit the parent `<color-picker>` component and add `<color-picker-footer>` to it:

**`components/color-picker/index.marko`**
```marko
class {
  onInput(input) {
    const { colors } = input;

    this.state = {
      selectedColor: colors[0],
      colors
    };
  }

  handleColorSelected(color) {
    this.state.selectedColor = color;
  }
}

<color-picker-header color=state.selectedColor/>
<color-picker-footer colors=state.colors on-color-selected('handleColorSelected')/>
```

Finally, we’ve…

- Added our `<color-picker-footer>`
- Passed the `state.colors` as `input` to it
- Added a `handleColorSelected` event handler for the `color-selected` event (emitted from `<color-picker-footer>`). When we handle it, we update the `state` of the `<color-picker>`, which is passed to the `<color-picker-header>`.

Congratulations! You have finished your first fully reactive Marko UI component!

Our finished product:

<!-- <color-picker colors=['#333745','#e63462','#fe5f55','#c7efcf','#eef5db','#00b4a6','#007db6','#ffe972','#9c7671','#0c192b']/>() -->
<img src="https://image.ibb.co/gcmLFk/color_picker_complete.png" alt="The final color picker component looks just like the original mockup.">
<!-- </> -->

Now let’s talk about some additional topics to turn you into a Marko pro!

## Importing Modules

Marko also supports importing modules, using the familiar ES2015 `import` syntax for single file components. Let’s fetch the default colors for `<color-picker>` from an external module, [`flat-colors`](https://www.npmjs.com/package/flat-colors):

```bash
npm install flat-colors
```

And we’ll create a new helper module for generating colors:

**`components/color-picker/util/getColors.js`**
```js
import { flatColors: colors } from 'flat-colors';

const HEX_INDEX = 3;

export default function getColors () {
  return colors
}

module.exports = function getColors () {
  return colors
    .filter((palette, i) => i % HEX_INDEX === 1)
    .slice(9);
};
```

We can import our helper module into the `color-picker` to use the generated colors as the default when none are passed as `input`:

**`components/color-picker/index.marko`**
```marko
import getColors from './util/getColors';

class {
  onInput(input) {
    const { colors = getColors() } = input;

    this.state = {
      selectedColor: colors[0],
      colors
    };
  }

  handleColorSelected(color) {
    this.state.selectedColor = color;
  }
}

<color-picker-header color=state.selectedColor/>
<color-picker-footer colors=state.colors on-color-selected('handleColorSelected')/>
```

Now if we do not pass `colors` to the `<color-picker>`, the colors will default to those obtained from `flat-colors`:

<!-- <color-picker/>() -->
<img src="https://image.ibb.co/k9pYLv/Screen_Shot_2017_06_05_at_5_08_55_PM.png" alt="The color picker populated with greens, blues, and purples from the “flat-colors” library.">
<!-- </> -->

[Try Online: `marko-color-picker`](https://markojs.com/try-online/?file=%2Fcolor-picker%2Findex.marko)

## Routing

Routes can be specified with subdirectories under the `routes/` folder.

The `routes/index` route is automatically registered as the index of the application. In a route directory, an `index.marko` or `route.js` file that exports a `handler` method may be created. [marko-starter](https://github.com/marko-js/marko-starter) is the underlying project that handles the routing, and automatically resolves routes from the `routes/` folder. See [marko-starter’s route documentation](https://github.com/marko-js/marko-starter#adding-pages) for more.

Alternatively, an `index.marko` file in the root directory of your project (e.g. `/marko-color-picker/index.marko`) will automatically be used as the index route’s template.

## Testing

`marko-cli` comes with a testing framework built on top of [mocha](https://mochajs.org/). We can easily add tests for our components by adding a `test.js` file inside the component’s directory.

First, let’s add the [chai](https://chaijs.com/) test assertion library:

```bash
npm install chai --save-dev
```

Now we can add a test to any component. Here’s a demonstration of a test for `<color-picker-header>`:

**`components/color-picker/components/color-picker-header/test.js`**
```js
import { expect } from 'chai';
const { test } = global;

test('color-picker-header color', context => {
  const html = context.render();

  expect(html.$('div').attr('style')).to.contain('background-color:#000000');
});

test('color-picker-header class included', context => {
  const output = context.render();
 
  expect(output.$('div.color-picker-heder').to.exist();
});
```

Here is another example, of a test for `<color-picker-selection>`:

**`components/color-picker/components/color-picker-selection/test.js`**
```js
const expect = require('chai').expect;
const { test } = global;

test('color-picker-selection color', context => {
  const testColor = '#ff8080';
  const html = context.render({
    color: testColor
  });

  expect(html.$('div').attr('style')).to.contain(`background-color:${testColor}`);
});

test('color-picker-selection when clicked should emit color-selected event', function (context) {
  const { component } = context.render();
  let isCalled = false;
  
  component.on('color-selected', () => {
    isCalled = true;
  });

  component.el.click();

  expect(isCalled).to.equal(true);
});
```

Let’s add a `test` script to our `package.json`:

```json
{
  "scripts": {
    "start": "marko-starter server",
    "build": "marko-starter build",
    "test": "marko test"
  }
}
```

Now we can run our tests with:

```bash
npm test
```

More information about Marko component testing can be found in the [marko-cli component testing documentation](https://github.com/marko-js/marko-cli#component-testing).

## Conclusion

Developing Marko UI components is fun and easy! As you develop, you should consider how a component can be split into multiple
subcomponents. This makes developing, managing, and testing significantly easier.

## Additional Resources

- [GitHub: marko-color-picker](https://github.com/marko-js-samples/marko-color-picker)
- [Try Online: Color Picker](https://markojs.com/try-online/?file=%2Fmarko-color-picker%2Findex.marko)
- [marko-cli](https://github.com/marko-js/marko-cli)

--------------

> Special thanks to [Anthony Ng](https://github.com/newyork-anthonyng) for helping with this tutorial!

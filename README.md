[![Build Status](https://alidoustkani.visualstudio.com/Richtext/_apis/build/status/CI%20Build?branchName=master)](https://alidoustkani.visualstudio.com/Richtext/_build/latest?definitionId=7&branchName=master)
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square)](https://cypress.io)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![npm version](https://badge.fury.io/js/%40alidoustkani%2Frichtext.svg)](https://badge.fury.io/js/%40alidoustkani%2Frichtext)

# Story 🎉💻
Well, I know there are lot's of powerful **richtext** editors out in the wild! But I couldn't skip the fun parts, so I created one beacuase I needed something for my blog. This editor works based on contenteditable but I have avoided to use execCommand. You can check out the demo [here](https://richtext.alidoustkani.com).
![Demo](https://richtext.alidoustkani.com/richtext.gif)

# Getting Started
First of all you need an empty element on the page to handle the editor. It could be a `<div>` or an `<article>`:
```html
<article id="richtext"></article>
```
To use the richtext you can both download it or install it from the npm.

### JS File
Download the last version from [here](https://github.com/Ali-Doustkani/richtext/releases). And: 
```html
<script src="richtext.js"></script>
<script>
  var rt = Richtext.create(document.getElementById('richtext'), options); // See below for configuring options.
  // apply the styles on UI events. See below.
</script>
```

### NPM
You can also install Richtext from npm:
```
npm i @alidoustkani/richtext
```
```javascript
import {create} from '@alidoustkani/richtext'

const rt = create(document.getElementById('richtext'), options) // see below for options
```

# API & Options
There are two kinds of methods in richtext: `style()` and `apply()`.
`style()` applies the style to the selected text, and if there is no selection there won't be any style. `apply()` applies the style to the selected text and when there is no selection available it will add the style to the whole paragraph.
```javascript
{
  defaulLink: 'https://',
  staySelected: true,
  decors: {
    important: 'strong', 
    highlight: {
      tag: 'span', 
      className: 'highlight-class-name'
    },
    notebox: {
      parent: true,
      tag: 'div',
      className: 'notebox-class-name'
    }
  }
}
```
### Options
* **defaultLink**: default text in the link popup.
* **staySelected**: for `true` value, the selection will remain the same after applying styles.
* **decors**: styling configuration. Use this option to define your styling elements and css classes.

### API
* **apply(type)**
* **applyUnorderedList()**
* **applyOrderedList()**
* **applyCodebox()**
* **selectImage()**
* **setOptions(options)**
* **style(type)**
* **styleLink()**

# Example
```javascript
import {create} from '@alidoustkani/richtext'

const rt = create(document.getElementById('richtext'), {
  defaulLink: 'https://',
  staySelected: true,
  decors: {
    important: 'strong', 
    highlight: {
      tag: 'span', 
      className: 'highlight-class-name'
    },
    notebox: {
      parent: true,
      tag: 'div',
      className: 'notebox-class-name'
    }
  }
})

importantBtn.addEventListener('click', () => {
  rt.style('important') // <strong>TEXT</strong>
})

highlightBtn.addEventListener('click', () => {
  rt.style('highlight') // <span class="highlight-class-name">TEXT</span>
})

noteboxBtn.addEventListener('click', () => {
  rt.apply('notebox') // <div class="notebox-class-name">TEXT</div>
})

linkBtn.addEventListener('click', () => {
  rt.styleLink() // <a href="LINK">TEXT</a>
})

ulBtn.addEventListener('click', () => {
  rt.applyUnorderedList() // <ul><li>TEXT</li></ul>
})

olBtn.addEventListener('click', () => {
  rt.applyOrderedList() // <ol><li>TEXT</li></ol>
})

imageBtn.addEventListener('click', () => {
  rt.selectImage() // <figure><img src="SRC"><figcaption>CAPTION</figcaption></figure>
})
```
# License
[MIT License](https://github.com/Ali-Doustkani/richtext/blob/master/LICENSE)

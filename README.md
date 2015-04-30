BTR 
===

## What is this?

BTR - this template engine.
It used to convert into HTML BTRJSON
It was founded at the [bh](https://github.com/enb-make/bh)

## Advantages

1. fast;
2. easy to debug due to no need of compilation to another code;
3. based on JavaScript (usage and extensions);
4. easy to understand – it is a wrapper over a regular conversion of source BTRJSON to output BTRJSON / HTML;
5. compact on client side;
6. Designed for use with [vDOM](https://github.com/egor-a-trubnikov-panov/vDOM)

## Install

```
npm install btr
```

## Usage

BTR files within a project have `tmpl.js` suffix (for example, `button.tmpl.js`).

Use `apply` method to convert source tree of BTRJSON into an output HTML.
Use `processBtrJson` method to get an interim result in detailed BTRJSON tree form.

Common use case:

```javascript
var btr = new (require('btr').BTR);
btr.match('button', function(ctx) {
    ctx.tag('button');
})
btr.processBtrJson({ block: 'button' }); // { block: 'button', mods: {}, tag: 'button' }
btr.apply({ block: 'button' }); // '<button class="button"></button>'
```

## Conversion

Working functions for BTRJSON are **templates**. Use `match` method to declare templates. Logic of BTRJSON conversion is declared in a function body.

There are two arguments provided to a template function:
* `ctx` – instance of `Ctx` class;
* `json` – link to a current BTRJSON tree node.

*N.B.* Do not make changes directly in `json` object. Use methods of `ctx` object instead. We recommend you to use `json` object for reading only (see also `ctx.json()` method).

Syntax:

```javascript
{BTR} btr.match({String} expression, function({Ctx} ctx, {Object} json) {
    //.. actions
});
```

You could also declare several templates within one call of `match` method.

Syntax:

```javascript
{BTR} btr.match({Array} expressions, function({Ctx} ctx));

```

Where `expressions` is an array like this:

```javascript
[
    {String} expression1,
    ...,

    {String} expressionN
]
```

Or in an object form:

```javascript
{BTR} btr.match({Object} templates);

```

Where `templates` is an object like this:

```javascript
{
    {String} expression1 : function({Ctx} ctx) {
        //.. actions1
    },

    ...,

    {String} expressionN : function({Ctx} ctx) {
        //.. actionsN
    },
}
```

You can find below a list of `Ctx` class methods. Let's check examples for step-by-step explanation.

For instance, to declare `button` tag for `button` block and `input` tag for `input` block do the following:

```javascript
btr.match('button', function(ctx) {
    ctx.tag('button');
});
btr.match('input', function(ctx) {
    ctx.tag('input');
});
```

Now we are going to create a pseudo button that looks like a button and acts like a link. If `pseudo` modifier of the button is set to `true`, you need to add  tag `a` and attribute `role="button"` to your template.

```javascript
btr.match('button_pseudo_yes', function(ctx) {
    ctx
        .tag('a')
        .attr('role', 'button');
});
```

In this example, we do not match just to `button` block. We match to `button` block with modifier `pseudo` that has `yes` value.

## Matching

Let's go into details of syntax of a matching string for conversion functions (optional parameters are set in square brackets):

```javascript
'block[_blockModName[_blockModVal]][__elemName][_elemModName[_elemModVal]]'
```

## Setting up

The `setOptions` method allows you to set the template engine parameters.

### jsAttrName

`jsAttrName` allows you to set the attribute name to store the `js` field. Default value is `onclick`.

```javascript
btr.setOptions({ jsAttrName: 'data-bem' });
btr.apply({ block: 'button', js: true });
```

```html
<div class="button i-bem" data-bem='return {"button":{}}'></div>
```

### jsAttrScheme

The data store format in the attribute. Default value is `js`.

```javascript
btr.setOptions({ jsAttrScheme: 'json' });
btr.apply({ block: 'button', js: { foo: bar } });
```

```html
<div class="button i-bem" onclick='{"button":{"foo":"bar"}}'></div>
```

### jsCls

The name of additional class for nodes with `js`. Default value is `i-bem`. If you set the `false` value, the additional class will not be added.

```javascript
btr.setOptions({ jsCls: false });
btr.apply({ block: 'button', js: true });
```
```html
<div class="button" onclick='{"button":{}}'></div>
```

### escapeContent

`escapeContent` turns on content escaping. Option is turned off by default.

```javascript
btr.setOptions({ escapeContent: true });
btr.apply({ content: '&lt;script&gt;' });

```

```html
<div>&lt;script&gt;</div>
```

## Additional examples

For example, if you want to set `state` modifier with `closed` value for all blocks do the following:

```javascript
btr.match('popup', function(ctx) {
    ctx.mod('state', 'closed');
});
```

Mix `form` with `search-form`:

```javascript
btr.match('search-form', function(ctx) {
    ctx.mix({ block: 'form' });
});
```

Specify a class for `page` block:

```javascript
btr.match('page', function(ctx) {
    ctx.cls('ua_js_no ua_css_standard');
});
```

## BTRJSON-tree conversion

In addition to element modification, converter function can return a new BTRJSON. For this, we will use following methods:

* `ctx.json()` that returns a current element “as is”;
* `ctx.content()` that returns and sets a content.

For example, let's wrap `header` block with `header-wrapper` block:

```javascript
btr.match('header', function(ctx) {
    return {
        block: 'header-wrapper',
        content: ctx.json()
    };
});
```

*N.B.* Any non-undefined value will replace current node in BTRJSON tree. So you can delete current node just returning `null` value.

Then wrap a content of `button` block with `content` element:

```javascript
btr.match('button', function(ctx) {
    ctx.content({
        elem: 'content',
        content: ctx.content()
    }, true);
});
```

`ctx.content` method gets BTRJSON as first argument that should be specified for a content. The second argument is a `force` flag that specifies a content even if it already exists.

Let's add following elements to `header` block:

* `before` element in the very beginning of the block content;
* `after` elemtnet in the end of the block content.

```javascript
btr.match('header', function(ctx) {
    ctx.content([
        { elem: 'before' },
        ctx.content(),
        { elem: 'after' }
    ], true);
});
```

Add `before-button` block before `button` block:

```javascript
btr.match('button', function(ctx) {
    return [
        { block: 'before-button' },
        ctx.json()
    ];
});
```

## Infinite loop detection

The `enableInfiniteLoopDetection` method allows you to enable or disable the infinite loop detection process.

*N.B.* Enable the infinite loop detection in debugging mode only, because it slows down a template engine application.

```javascript
btr.enableInfiniteLoopDetection(true);
btr.match('button', function(ctx) {
    ctx.content({ block: 'button' });
});
```

```
Error: Infinite matcher loop detected at "button".
```


# `Ctx` class

`Ctx` class instances are passed to all templates. All class methods in a set mode return the class instance.

## ctx.process(bemJson)

This class method applies templates for given BTRJSON tree in the current context. It returns the processed BTRJSON.

```javascript
btr.match('button', function(ctx) {
    btr.toHtml(ctx.process({ elem: 'control' }));
});
```

## ctx.tag([value[, force]])

This class method returns/sets a tag depending on arguments. Use **force** to set the tag value even if it was specified earlier.

```javascript
btr.match('input', function(ctx) {
    ctx.tag('input');
});
```

*N.B.* If you set a value as `false` or as an empty string, the template will not put the current node to output HTML. The template will put only the content of this node if it exists.

## ctx.mod(key[, value[, force]])

This class method returns/sets a modifier depending on arguments. Use **force** to set the modifier even if it was specified earlier.

```javascript
btr.match('input', function(ctx) {
    ctx.mod('native', 'yes');
    ctx.mod('disabled', true);
});

btr.match('input_islands_yes', function(ctx) {
    ctx.mod('native', '', true);
    ctx.mod('disabled', false, true);
});
```

## ctx.mods([values[, force]])

This class method returns/sets modifiers depending on arguments. Use **force** to set the modifiers even if they were specified earlier.

```javascript
btr.match('paranja', function(ctx) {
    ctx.mods({
        theme: 'normal',
        disabled: true
    });
});
```

## ctx.attr(key[, value[, force]])

This class method returns/sets an attribute depending on arguments. Use **force** to set the attribute even if it was specified earlier.

```javascript
btr.match('input_disabled_yes', function(ctx) {
    ctx.attr('disabled', 'disabled');
});
```

*N.B.* If an attribute is needed to be deleted and not nulled in its value, you have to pass `null` as a second parameter:

```javascript
btr.match('link', function(ctx) {
    ctx.attr('href', null);
});
```

## ctx.attrs([values[, force]])

This class method returns/sets attributes depending on arguments. Use **force** to set the attributes even if they were specified earlier.

```javascript
btr.match('input', function(ctx) {
    ctx.attrs({
        name: ctx.param('name'),
        autocomplete: 'off'
    });
});
```

## ctx.mix([value[, force]])

This class method returns/sets a mix value depending on arguments.

Use **force** to set the attribute even if it was specified earlier.

If **force** has `true` value, the specified mix replaces the previous value, otherwise the both mixes are added.

```javascript
btr.match('button_pseudo_yes', function(ctx) {
    ctx.mix({ block: 'link', mods: { pseudo: 'yes' } });
    ctx.mix([
        { elem: 'text' },
        { block: 'ajax' }
    ]);
});
```

## ctx.bem([value[, force]])

This class method returns/sets `bem` value depending on arguments. Use **force** to set the `bem` value even if it was specified earlier.

If `bem` has `false` value, any BEM classes will not be generated for an element.

```javascript
btr.match('meta', function(ctx) {
    ctx.bem(false);
});
```

## ctx.js([value[, force]])

This class method returns/sets `js` value depending on arguments. Use **force** to set the `js` value even if it was specified earlier.

Use `js` value for blocks initialization in browser by `BEM.DOM.init()`.

```javascript
btr.match('input', function(ctx) {
    ctx.js(true);
});
```

## ctx.cls([value[, force]])

This class method returns/sets CSS class additional value depending on arguments. Use **force** to set the `cls` value even if it was specified earlier.

```javascript
btr.match('field_type_email', function(ctx) {
    ctx.cls('validate');
});
```

```html
<div class="field field_type_email validate"></div>
```

## ctx.content([value[, force]])

This class method returns/sets a content depending on arguments. Use **force** to set the content even if it was specified earlier.

```javascript
btr.match('input', function(ctx) {
    ctx.content({ elem: 'control' });
});
```

## ctx.json()

Returns the current section of BTRJSON tree. You could use this class method with `return` method for wrapping. For brevity, you can use the second argument of the template function – `json`.

*N.B.* The call of `ctx.applyBase()` function breaks the chain of consistent templates application. This causes the case when `json` stops to point out the current node in BTRJSON tree. To avoid this you must use `ctx.json()` method.

```javascript
btr.match('input', function(ctx, json) {
    return {
        elem: 'wrapper',
        attrs: { name: json.name },
        content: ctx.json()
    };
});
```

## ctx.position()
**ctx.position()** returns the position of the current BTRJSON element within parental element.
See example for `ctx.position()`, `ctx.isFirst()` and `ctx.isLast()` below.

## ctx.isFirst()
**ctx.isFirst()** returns `true` if the current BTRJSON element is the first within the parental BTRJSON element.
See example for `ctx.position()`, `ctx.isFirst()` and `ctx.isLast()` below.

## ctx.isLast()
**ctx.isLast()** returns `true` if the current BTRJSON element is the last within the parental BTRJSON element.

Example for `ctx.position()`, `ctx.isFirst()` and `ctx.isLast()`:

```javascript
btr.match('list__item', function(ctx) {
    ctx.mod('pos', ctx.position());
    if (ctx.isFirst()) {
        ctx.mod('first', 'yes');
    }
    if (ctx.isLast()) {
        ctx.mod('last', 'yes');
    }
});
```

## ctx.isSimple()

Verifies that object is a primitive.

```javascript
btr.match('link', function(ctx) {
    ctx.tag(ctx.isSimple(ctx.content()) ? 'span' : 'div');
});
```

## ctx.extend()

This class method is analogue of `extend` function in jQuery.

## ctx.applyBase()

This class method converts the BTRJSON element by another templates. For example, it could be used to add the element in the end of the content after all other elements that are added in the end by base templates.

For example:

```javascript
btr.match('header', function(ctx) {
   ctx.content([
       ctx.content(),
       { elem: 'under' }
   ], true);
});

btr.match('header_float_yes', function(ctx) {
   ctx.applyBase();
   ctx.content([
       ctx.content(),
       { elem: 'clear' }
   ], true);
});
```

## ctx.stop()

This class method stops application of other templates for BTRJSON element.

For example:

```javascript
btr.match('button', function(ctx) {
    ctx.tag('button', true);
});
btr.match('button', function(ctx) {
    ctx.tag('span');
    ctx.stop();
});
```

## ctx.generateId()

This class method returns the unique identifier. For example, you can use it to set the correspondence between `label` and` input`.

## ctx.param(key[, value[, force]])

This class method returns/sets parameter of the current BTRJSON element. Use **force** to set the parameter value even if it was specified earlier.

For example:

```javascript
btr.match('search', function(ctx) {
    ctx.attr('action', ctx.param('action') || '/');
});
```

## ctx.tParam(key[, value[, force]])

This class method get / passes a parameter into BTRJSON tree. Use **force** to set the parameter value even if it was specified earlier.

```javascript
btr.match('input', function(ctx) {
    ctx.content({ elem: 'control' });
    ctx.tParam('value', ctx.param('value'));
});

btr.match('input__control', function(ctx) {
    ctx.attr('value', ctx.tParam('value'));
});
```

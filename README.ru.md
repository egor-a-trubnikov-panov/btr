BTR
===

## Что это?

BTR — это шаблонизатор.
Используется для преобразования BTRJSON в HTML
Онован на [bh](https://github.com/enb-make/bh)

## Преимущества

1. Быстрый.
2. Удобен в отладке, т.к. не компилируется в другой код.
3. Написан на чистом JavaScript, используется и расширяется через JavaScript.
4. Прост для понимания, т.к. это обертка над обычными преобразованиями исходного BTRJSON в конечный BTRJSON / HTML.
5. Компактен на клиенте.
6. Расчитан на использование с [vDOM](https://github.com/egor-a-trubnikov-panov/vDOM) 

## Установка

```
npm install btr

```

## Использование

btr-файлы в проекте имеют суффикс `tmpl.js` (например, `button.tmpl.js`).

Для преобразования исходного дерева BTRJSON в конечный HTML используется метод `apply`. 
Для получения промежуточного результата в виде развернутого BTRJSON-дерева нужно использовать метод `processBtrJson`.

Простой пример использования:
```javascript
var btr = new (require('btr').BTR);
btr.match('button', function(ctx) {
    ctx.tag('button');
})
btr.processBtrJson({ block: 'button' }); // { block: 'button', mods: {}, tag: 'button' }
btr.apply({ block: 'button' }); // '<button class="button"></button>'
```

## Преобразования

Функции для работы с BTRJSON — **шаблоны** — объявляются через метод `match`. В теле функций описывается логика преобразования BTRJSON.
В функцию-шаблон передаются два аргумента: `ctx` — экземпляр класса `Ctx` и `json` — ссылка на текущий узел BTRJSON-дерева.

*Замечание:* Категорически не рекомендуется вносить изменения напрямую в объект `json`. Вместо этого следует использовать методы объекта `ctx`. Объект `json` рекомендуется использовать только для «чтения» (см. также метод `ctx.json()`).

Синтаксис:

```javascript
btr.match({String} expression, function({Ctx} ctx, {Object} json) {
    //.. actions
});
```

Также допустимо объявлять несколько шаблонов в одном вызове метода `match`.

Синтаксис:

```javascript
btr.match({Array} expressions, function({Ctx} ctx));

```

Где `expressions` — массив вида:

```javascript
[
    {String} expression1,
    ...,

    {String} expressionN
]
```

Или в виде объекта:

```javascript
btr.match({Object} templates);

```

Где `templates` представляет собой объект вида:

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

Ниже в этом документе можно найти перечень методов класса `Ctx`. Дальше пойдем по примерам.

Например, зададим блоку `button` тег `button`, а блоку `input` тег `input`:

```javascript
btr.match('button', function(ctx) {
    ctx.tag('button');
});
btr.match('input', function(ctx) {
    ctx.tag('input');
});
```

Теперь нам нужна псевдо-кнопка. То есть, если у кнопки модификатор `pseudo` равен `yes`, то нужен тег `a` и атрибут `role="button"`:

```javascript
btr.match('button_pseudo_yes', function(ctx) {
    ctx
        .tag('a')
        .attr('role', 'button');
});
```

В данном примере мы матчимся не просто на блок `button`, а на блок `button` с модификатором `pseudo`, имеющим значение `yes`.

## Матчинг

Рассмотрим синтаксис строки матчинга для функций преобразования (в квадратных скобках указаны необязательные параметры):

```javascript
'block[_blockModName[_blockModVal]][__elemName][_elemModName[_elemModVal]]'
```

По-русски:

```javascript
'блок[_имяМодификатораБлока[_значениеМодификатораБлока]][__имяЭлемента][_имяМодификатораЭлемента[_значениеМодификатораЭлемента]]'
```

## Настройка

Метод `setOptions` позволяет задавать параметры шаблонизации.

### jsAttrName

Позволяет задать имя атрибута для хранения поля `js`. Значение по умолчанию — `onclick`.

```javascript
btr.setOptions({ jsAttrName: 'data-bem' });
btr.apply({ block: 'button', js: true });
```
```html
<div class="button i-bem" data-bem='return {"button":{}}'></div>
```

### jsAttrScheme

Формат хранения данных в атрибуте. По умолчанию `js`

```javascript
btr.setOptions({ jsAttrScheme: 'json' });
btr.apply({ block: 'button', js: { foo: bar } });
```
```html
<div class="button i-bem" onclick='{"button":{"foo":"bar"}}'></div>
```

### jsCls

Имя дополнительного класса для узлов, имеющих `js`. По умолчанию `i-bem`.
Если передать значение `false`, дополнительный класс не будет добавляться.

```javascript
btr.setOptions({ jsCls: false });
btr.apply({ block: 'button', js: true });
```
```html
<div class="button" onclick='{"button":{}}'></div>
```

### escapeContent

Включает эскейпинг содержимого. По умолчанию выключен.

```javascript
btr.setOptions({ escapeContent: true });
btr.apply({ content: '<script>' });
```
```html
<div>&lt;script&gt;</div>
```

## Дополнительные примеры

Например, мы хотим установить модификатор `state` со значением `closed` для всех блоков `popup`:

```javascript
btr.match('popup', function(ctx) {
    ctx.mod('state', 'closed');
});
```

Замиксуем `form` с `search-form`:

```javascript
btr.match('search-form', function(ctx) {
    ctx.mix({ block: 'form' });
});
```

Установим класс для `page`:

```javascript
btr.match('page', function(ctx) {
    ctx.cls('ua_js_no ua_css_standard');
});
```

## Преобразование BTRJSON-дерева

Кроме модификации элемента, функция-преобразователь может вернуть новый BTRJSON. Здесь мы воспользуемся методами `ctx.json()` (возвращает текущий элемент BTRJSON «как есть») и `ctx.content()` (возвращает или устанавливает контент).

Например, обернем блок `header` блоком `header-wrapper`:

```javascript
btr.match('header', function(ctx) {
    return {
        block: 'header-wrapper',
        content: ctx.json()
    };
});
```

*Замечание:* Любое не-undefined значение вставляется в конечное BTRJSON-дерево вместо текущего узла. Соответственно, удалить текущий узел можно просто вернув значение `null`.

Обернем содержимое `button` элементом `content`:

```javascript
btr.match('button', function(ctx) {
    ctx.content({
        elem: 'content',
        content: ctx.content()
    }, true);
});
```

Метод `ctx.content` принимает первым аргументом BTRJSON, который надо выставить для содержимого, а вторым — флаг force (выставить содержимое, даже если оно уже существует).

Добавим элемент `before` в начало, а `after` — в конец содержимого блока `header`:

```javascript
btr.match('header', function(ctx) {
    ctx.content([
        { elem: 'before' },
        ctx.content(),
        { elem: 'after' }
    ], true);
});
```

Добавим блок `before-button` перед блоком `button`:

```javascript
btr.match('button', function(ctx) {
    return [
        { block: 'before-button' },
        ctx.json()
    ];
});
```

## Защита от зацикливания

Метод `enableInfiniteLoopDetection` позволяет включать и выключать механизм определения зацикливаний.

*Замечание:* Рекомендуется включать этот механизм только для отладки, так как он замедляет работу шаблонизатора.

```javascript
btr.enableInfiniteLoopDetection(true);
btr.match('button', function(ctx) {
    ctx.content({ block: 'button' });
});
```

```
Error: Infinite matcher loop detected at "button".
```


# Класс `Ctx`

Инстанции класса `Ctx` передаются во все шаблоны. Все методы класса в set-режиме возвращают инстанцию класса, то есть реализуют чейнинг.

## ctx.process(bemJson)

Применяет шаблоны для переданного BTRJSON-дерева в текущем контексте. Возвращает результат преобразований.

```javascript
btr.match('button', function(ctx) {
    btr.toHtml(ctx.process({ elem: 'control' }));
});
```

## ctx.tag([value[, force]])

Возвращает/устанавливает тег в зависимости от аргументов. **force** — задать значение тега, даже если оно было задано ранее.

```javascript
btr.match('input', function(ctx) {
    ctx.tag('input');
});
```

*Замечание:* Если передать в качестве значения `false` или пустую строку, текущий узел не будет выведен в конечный HTML, выведется только его содержимое, если оно есть.

## ctx.mod(key[, value[, force]])

Возвращает/устанавливает модификатор в зависимости от аргументов. **force** — задать модификатор, даже если он был задан ранее.

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

Возвращает/устанавливает модификаторы в зависимости от аргументов. **force** — задать модификаторы, даже если они были заданы ранее.

```javascript
btr.match('paranja', function(ctx) {
    ctx.mods({
        theme: 'normal',
        disabled: true
    });
});
```

## ctx.attr(key[, value[, force]])

Возвращает/устанавливает значение атрибута в зависимости от аргументов. **force** — задать значение атрибута, даже если оно было задано ранее.

```javascript
btr.match('input_disabled_yes', function(ctx) {
    ctx.attr('disabled', 'disabled');
});
```

*Замечание:* Если необходимо удалить сам атрибут, а не просто обнулить значение атрибута, то вторым параметром надо передать `null`:

```javascript
btr.match('link', function(ctx) {
    ctx.attr('href', null);
});
```

## ctx.attrs([values[, force]])

Возвращает/устанавливает атрибуты в зависимости от аргументов. **force** — задать атрибуты, даже если они были заданы ранее.

```javascript
btr.match('input', function(ctx) {
    ctx.attrs({
        name: ctx.param('name'),
        autocomplete: 'off'
    });
});
```

## ctx.mix([value[, force]])

Возвращает/устанавливает значение mix в зависимости от аргументов.

При установке значения если **force** равен **true**, то переданный микс заменяет прежнее значение, в противном случае миксы складываются.

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

Возвращает/устанавливает значение `bem` в зависимости от аргументов. **force** — задать значение `bem`, даже если оно было задано ранее.

Если `bem` имеет значение **false**, то для элемента не будут генерироваться БЭМ-классы.

```javascript
btr.match('meta', function(ctx) {
    ctx.bem(false);
});
```

## ctx.js([value[, force]])

Возвращает/устанавливает значение `js` в зависимости от аргументов. **force** — задать значение `js`, даже если оно было задано ранее.

Значение `js` используется для инициализации блоков в браузере через `BEM.DOM.init()`.

```javascript
btr.match('input', function(ctx) {
    ctx.js(true);
});
```

## ctx.cls([value[, force]])

Возвращает/устанавливает дополнительное значение CSS-класса в зависимости от аргументов. **force** — задать значение `cls`, даже если оно было задано ранее.

```javascript
btr.match('field_type_email', function(ctx) {
    ctx.cls('validate');
});
```

```html
<div class="field field_type_email validate"></div>
```

## ctx.content([value[, force]])

Возвращает/устанавливает содержимое в зависимости от аргументов. **force** — задать содержимое, даже если оно было задано ранее.

```javascript
btr.match('input', function(ctx) {
    ctx.content({ elem: 'control' });
});
```

## ctx.json()

Возвращает текущий фрагмент BTRJSON-дерева. Может использоваться в связке с `return` для враппинга и подобных целей. Для сокращения можно использовать второй аргумент функции-шаблона — `json`.

*Замечание:* После вызова `ctx.applyBase()` нарушается цепочка естественного применения шаблонов. Из-за этого `json` перестает указывать на актуальный узел в BTRJSON-дереве. В этом случае следует использовать `ctx.json()`.

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
**ctx.position()** возвращает позицию текущего BTRJSON-элемента в рамках родительского.
См. пример для `ctx.position()`, `ctx.isFirst()` и `ctx.isLast()`.

## ctx.isFirst()
**ctx.isFirst()** возвращает `true`, если текущий BTRJSON-элемент — первый в рамках родительского BTRJSON-элемента.
См. пример для `ctx.position()`, `ctx.isFirst()` и `ctx.isLast()`.

## ctx.isLast()
**ctx.isLast()** возвращает `true`, если текущий BTRJSON-элемент — последний в рамках родительского BTRJSON-элемента.

Пример для `ctx.position()`, `ctx.isFirst()` и `ctx.isLast()`:
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

Проверяет, что объект является примитивом.
```javascript
btr.match('link', function(ctx) {
    ctx.tag(ctx.isSimple(ctx.content()) ? 'span' : 'div');
});
```

## ctx.extend()

Аналог функции `extend` в jQuery.

## ctx.applyBase()

Выполняет преобразования данного BTRJSON-элемента остальными шаблонами. Может понадобиться, например, чтобы добавить элемент в самый конец содержимого, если в базовых шаблонах в конец содержимого добавляются другие элементы.

Пример:

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

Останавливает выполнение прочих шаблонов для данного BTRJSON-элемента.

Пример:

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

Возвращает уникальный идентификатор. Может использоваться, например, чтобы задать соответствие между `label` и `input`.

## ctx.param(key[, value[, force]])

Возвращает/устанавливает параметр текущего BTRJSON-элемента. **force** — задать значение параметра, даже если оно было задано ранее. Например:

```javascript
btr.match('search', function(ctx) {
    ctx.attr('action', ctx.param('action') || '/');
});
```

## ctx.tParam(key[, value[, force]])

Получает / передает параметр вглубь BTRJSON-дерева. **force** — задать значение параметра, даже если оно было задано ранее.

```javascript
btr.match('input', function(ctx) {
    ctx.content({ elem: 'control' });
    ctx.tParam('value', ctx.param('value'));
});

btr.match('input__control', function(ctx) {
    ctx.attr('value', ctx.tParam('value'));
});
```

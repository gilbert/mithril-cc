# mithril-cc

An opinionated library for writing [Mithril.js](https://mithril.js.org) components.

## Motivation

Mithril is the leader and forerunner of declarative HTML views **in plain old JavaScript**. However, its flourishing flexibility can leave one uneasy on the "right" way to do things. The wide array of available options all have different pros and cons that depend on the type of component you're writing.

To cure, CC compresses these options into a pleasant, one-size-fits-all approach, allowing you to trade discouraging decision fatigue for simple peace and tranquility.

In other words: Closure components are the epitome of userland Mithril, and CC brings out the best in them.

## Getting Started

```bash
yarn add mithril-cc
# or
npm install mithril-cc
```

In your component files:

```js
import {cc} from 'mithril-cc'
```

### Using a CDN

If you use a CDN, mithril-cc will be available via `m.cc`, `m.ccs`, etc.

```html
<script src="https://unpkg.com/mithril/mithril.js"></script>
<script src="https://unpkg.com/mithril/stream/stream.js"></script>
<script src="https://unpkg.com/mithril-cc"></script>
```

### TypeScript

For type inference, simply parameterize your `cc` calls:

```ts
type Attrs = {
  initialCount: number
}
const Counter = cc<Attrs>(/* ... */)
```

## Learn by Example

- [Simple counter](#user-content-simple-counter)
- [View Attrs](#user-content-view-attrs)
- [Component Setup](#user-content-component-setup)
- [Reacting to Attrs Changes](#user-content-reacting-to-attrs-changes)
- [Unsubscribe](#user-content-unsubscribe)
- [Lifecycle Methods](#user-content-lifecycle-methods)
- [`addEventListener`](#user-content-addeventlistener)
- [`setTimeout` and `setInterval`](#user-content-settimeout-and-setinterval)
- [React Hooks-like Abstractions](#user-content-react-hooks-like-abstractions)
- [Shorthand Components](#user-content-shorthand-components)

### Simple Counter

State in a `cc` closure component is as simple as you could ever hope for. Set some variables, return a view thunk, and you're ready to go.

```js
import m from 'mithril'
import {cc} from 'mithril-cc'

const Counter = cc(function(){
  let n = 0
  return () => [
    m('p', 'Count: ', n),
    m('button', { onclick: () => n++ }, 'Inc')
  ]
})
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIAwrQCuwgE6SAvJKz5q1ABRgF1YhHraAlMAA6aSZNhSragAyXrimMTmKrp1QD5JyZ2t1bQByAAcQikkAA1kFYkRJABJgNFZokwpA6yxQgCM5YmJ6SMlgSXpqKAhqAGtE7xU-NABqFsl2SRCASTRqEJNAgF1LVkG0Sw0seQZtABNaajkcBnw82jmATyi4pXHKGlosMOgYRTw8jDyYcio4G5gDIzQEHgBmRAAmADY2DhBMDg8Jo4AJDsJmDw2EMqNU0LVXqgAVw8FgIMRCIpoAcPOQeCRiGE4IgAPQkhRhWoAc00RxJaIxWKgAAFPvgHPgACz09GY6D4NFofD8A7ETZhbggODULFhUTsThAngSVzYHGKPEgAlE0nktCUml0LA8xnQVnsrkklUwbBW4iqjQiqhiiV4aWy+X-QGShl8qAAWi06s12uJZIp1Npxt9TMD1GZHIAnPhviS5hAJP7lnMSRA0HMYAAPYVgl2S90QOXQ1hAA)

### View Attrs

For convenience, Mithril's `vnode.attrs` are made available directly as the first parameter to your view thunk.

```js
const Greeter = cc(function(){
  return (attrs) => (
    m('p', `Hello, ${attrs.name}!`)
  )
})
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIA4gCcYMRrMkBeSVnzVqACjABXNNWIR62gJTAAOmkmT5xPbJvaMxYrLhnVAPknbrtrZY2gDkAA4hFJIABgASMFBQtFEAJMCu7nD4mDisAITRZgGSRWispdYaWLQGxNoAJrTUejgM+ABGtPUAnlFWNpIAbhAwAO6Ifl4qvsFyCkp9kjkwEyEAglAQ1DAhkuXW+2iUNLRYYdAwsnjtGO0Jx3AJMEYmaAg8AJyIAAxsHCDLPCaOACE7CZg8NgAXSomzQAGt3qgAVw8FgIMRCLJoMdHOQeCRiGE4IgAPSkgxheEAc00p1J6Mx2KgAAEAEz4b74AAsDIxWOg+HRaHw-GOxG6YW4IDg1GxYVE7E4ODwEnk2FxsnxIEJxLJFLQVNpdCwfKZ0HZnJ5pLVMGwNvcdo0YqoEqlqrlEAVf2V0sZAqgAFotJrtbqSeTKTS6ab-czg9QWVyPvgAGyk+oQCSBlr1UkQND1GAAD1FoLd0tl8sVUNYQA)

In case you need it, vnode is provided as a second parameter.

### Component Setup

Sometimes you need to set up state when your component gets initalized. CC provides your component with `attrs` **as a [stream](https://mithril.js.org/stream.html)**. Note how this is different from your view thunk, which receives `attrs` directly (as a non-stream).

Because it's a stream, your setup callbacks always have access to the latest value of you component's attrs.

```js
const Counter = cc(function($attrs){
  let n = $attrs().initialCount
  return () => [
    m('p', 'Count: ', n),
    m('button', { onclick: () => n++ }, 'Inc')
  ]
})
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIAwrQCuwgE6SAvJKz5q1ABRgF1YhHraAJBmLFFcAJTAAOmkmTYUx2rMWr26-ghoIhhhQsgrEDk6KMMRyio7eqgB8ksjhTuraAOQADhkUkhkhDIj5eWjWFKlOWJkARnIW9LmSwJL01FAQ1ADWxfEqSWgA1IOS7PkAkmjUGdapALoOrLNoDhpY8gzaACa01HI4DPg1tFsAnnn2jpIAbhAwAO691onphYyKF5J+ARBBb8UARgADKNlksHJQaLQsFloDBFHgahgajByFQ4KiYAYjGgEDxgYgAExsDggTA4PCaOACKHCZg8NhzKgdNBdPGoMlcPBYAKERTQSExcg8EjELJwRAAeklCiyXQA5ppoZKecQ+dAAAKE-BA-AAFhVvP5UHwPLQ+H4kOIpyy3BAcGo-KyonYnApPAkkWwgsUwpAovFUplaDliroWENauNWp1+slnpg2HjlkTGktVGttrwDqdLtJ5LtqvVUAAtFofX6AxLpbKFUqI0XjWXqBrdQBOfAANklWwgEhL+y2kr8WxgAA8LTTM3acxBnYzWEA)

### Reacting to Attrs Changes

Because top-level `attrs` is a [stream](https://mithril.js.org/stream.html), you can easily react to changes using `.map`.

Note also the `this.unsub =` in this example. This will clean up your stream listener when the component unmounts. You can assign it as many times as you like; CC will remember everything.

```js
import {cc, uniques} from 'mithril-cc'

const Greeter = cc(function($attrs){
  let rank = 0
  let renderCount = -1
  this.unsub = $attrs.map(a => a.name).map(uniques()).map(n => rank++)
  this.unsub = $attrs.map(() => renderCount++)

  return (attrs) => (
    m('p', `Hello, ${attrs.name}! You are person #${rank} (renderCount ${renderCount})`)
  )
})
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIA4gCcYMRrMkBeSVnzVqACjABXNNWIR62gCQZixWXACUwADppJk2FNkY0Aa1WSADE4ubpLyaAAmMLIAwrQGUmoAtACMgZLEhBBw+AZwegBGvhZWNvhYGAAO2hiqAHySGPiYOLalFdoaBhAAjnrw2rYtZZXOKnUe3gDUE7ap6ZnZaLkFakXWWUPa-bUhTBHRsQxTM2ip8sR6ss5VxXbb2qkuWNoA5OXPFJIABgASMFBQtA+ZmAljWjS4rAAhJIAJqxerySTlSJweiSADEwPGXlYkm0oT2MTikixu0iRIYrFsn2OLmOVKcTmCyJsaLUzwAglAINQYM8nBosAdiNowrRqHocAx8HlaGEAJ4fRzOSQANwgMAA7og8bZtsgHuptHIFEolZImjAdSzUc4qRRDU9nnk9FZ6O9JMBJPRqNzqF4dVtRkiUWzJJy-XzJOxwybFJIuTy+bYHSrHi8XW60B6vT6-QHddsbWHngAhWh5Z7Rj7PONScuVlOpAC6TgZaEoNFoWHK0EieDyGDyf07cD+MCMJkWeAAnIgAEwJPyIPxsDggS14TRwARd4TMHhsZtUbneBAoTg4PBYCDpWTQTsXcg8EjEcpwRAAek-BnKXgA5po3afjed7QAAAvO+B+PgAAsIG3oQ95QKUEBoPg-CdsQ8rIngcDUPe5SiOwl7cCAEjyNgj6yM+ICvu+X4-mgf6AXQWAIWBUCQdBcGfhRMDYHx1gCRomFUNhuE8PhhHEeum48KBSHQAkWjUbR9Eft+v4AUB7GKchKnUOBMEzvgABsn5hJkxAJJKYSfmhEQAB4YbuElkdJEBEUerBAA)

*Implementation detail: Because the `$attrs` stream gets updated before the view thunk, your view thunk will see the latest and correct version of your closure variables.*

### Unsubscribe

If CC doesn't cover your cleanup use case, you can assign `this.unsub =` to any function. CC will run the function when the component unmounts.

```js
const UnmountExample = cc(function(){
  this.unsub = () => console.log("unmount")
  return () => m('div', 'UnmountExample')
})
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIAqmiy0ArgwCiAD2wAHWJIC8krPmrUAFGCXViEesYCUwADppJk4oQhx8SuAoBGuyba6AHyS4rSw+FC0AObG9iBK8krE8TaOzgBOMMQKGU6BOiFYxgDkACYQAG4lFJIlskkq6lhaMCVpaKwdjrBScIS0AO7+xBkKMI4GjcTGZbTUCjgM+D60ZQCetQ5OkpUQMIOIATbBksjpzvqlPgrExPQ1ksCS9NRQENQA1kcFIf1D-gAhP9huxJCDJAB+OoNRQMEqSI4lACycOI7QoF2cEIAZDirrDkmpNLAOs4ALqOLqOSg0WgtaAwDJ4HwYHwwchUOAcmAWKxoBA8ACMQsQACY2BwQJgcHhDHABHThMweGxyVR3mhPoLUNKuHgsBBXBloLTcuQeCRiBo4IgAPR2pQaT7RQz0u2G43QAACYvwAAZ8AAWD1GwgmqD4Q1ofD8WnEdYabggODUE0aUTsTiyngSLLYM0ZC0gK02+2OtDO110LChr1QX0B4N2vMwbAt0ZtgxxqgJpN4VPpzNSmXJz3h6AAWiMheLpdtDqdLrdtfHEen1G9gYAnPgAOx2ioSSeLMp2iBoMowVSxxV95ODiAZtWsIA)

### Lifecycle Methods

Even though you're using view thunks, you still have access to all of Mithril's lifecycles via `this`. You can even call `oncreate` and `onupdate` multiple times, which can be useful for creating [React Hooks-like abstractions](#user-content-react-hooks-like-abstractions).

```js
const HeightExample = cc(function(){
  let height = 0
  this.oncreate(vnode => {
    height = vnode.dom.offsetHeight
    m.redraw()
  })
  return () => m('p', `The height of this tag is ${ height || '...' }px`)
})
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIAEjAgBzEgFEAHtgAOsSQF5JWfNWoAKMAFc01YhHpGAlMAA6aSZNhTCcxVN0AGJy+JCCDh8emoAJxgMRiMANzRaABMYHQA+SUdnF0kPBRIdSXikmHxE2n1aMDA4GGJZPOJ-bP1IxPCMAHc7JtZbJsjiU3DnOzS9IwBydQmKSQADABUPHM98yslA4I2MeUktgBJgFYbJAB9TyQn8a4nJVnUVOb60XqcnfSxac2IjMupTHAMfAAIySAE9ZvUvKoNLBnpQaOV1NAYOE8MCMMCYOQqDVYJZrGgEDwAIw+RA+NgcECYHB4AxwASI4TMHhsAC6VCgEDQAGtiagaVw8FgIIFwtAEUNyDwSMR1HBEAB6JXmdS8+QGcpK0Xi6AAAQATPgfPgACw6sWECVQfCitD4fgI4hg9TcEBwCIQdSidicOk8CSRbBS8IykByhXK1VodWauhYS16qBGk3mpVBqKJzPYR1Ml1uvCeiU+qn+92663QAC0hlD4cjipVao1WsTlZtteo+tNAE58AB2JWJYLEasAxJKnnJFR552u93F72+9msIA)

### addEventListener

Often times you need to listen for DOM events. With `this.addEventListener`, CC will automatically clean up your listener when the component unmounts. It will also call `m.redraw()` for you.

```js
const MouseCoords = cc(function(){
  let x = 0, y = 0

  this.addEventListener(window, 'mousemove', event => {
    x = event.offsetX, y = event.offsetY
  })
  return () => m('p', `Mouse is at ${x}, ${y}`)
})
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIAsrQCucGAGFatAE4ATOJIC8krPmrUAFGDlpqxCPWMBKYAB00kybCkAPXZIAMFSQE8vbycnF2JCCDh8DA0NAFEANxEAGUjGNBg1YwB3CDQNWmy-AHIseUUypOK-GCSGXQA+SUdnF0lPPVqRfFowMEViAA0-QM664h6+gYBNUMlWWzm1GGI5NWc7Rv1jYoAHaskAA1kFGElIyQwpABJgd3ZJW-9WQ8W0BZC0AzLzYmMC6hyHAMfAAI1oGn8fhOihU6i0b0oNFoWF20EyeFBGFBMHIVEUsEs1jQCB4AEZvIhvGwOCBMDg8IY4AJkcJmDw2ABdKhQPIAa1JqDpXDwWAg4TU0CRa3IPBIxF2cEQAHpleZdnyAOaGFHKsUS6AAAQATPhvPgACx68WESVQfBitD4fhI4j+XbcEBwaiS3aidicBk8CTLbDStSykDyxUqtVoDXauhYa0GqAms2W5UhmDYLPEUMGF1UN0evDe33+2n0z3623QAC0RnDkejStV6q1OuTtbtjeohvNAE58AB2ZUaNL1oEaZV5DQwdzOlklz3liB+rmsIA)

### setTimeout and setInterval

Just like [this.addEventListener](#user-content-addeventlistener), you can use `this.setTimeout` and `this.setInterval` to get auto cleanup and redraw for free.

```js
const Delayed = cc(function(){
  let show = false
  this.setTimeout(() => {
    show = true
  }, 1000)
  return () => m('p', `Show? ${show}`)
})
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIAIjCgYAnjAAmkgLySs+atQAUYAK5pqxCPV0BKYAB00kybClxCtAO7rJYDFDgxb94kIIOHxfYgAVCBxaA2JdS3UAPkkbO3tJZzcPYgAnAz809kkARgAGcot-SRyYYgMcuwS1ZKxdAHIABzaKSQADAGUXVwB+SQASYEzXVl7KtFY52y0sGIZdZVpqAxwGfAAjWmUFHtl5JWU5yhpaLA7oGBy8PYw9uSvfWBMzNAQeAE5EKU2BwQJgcHhtHABNdhMweGwALpUKAQNAAa1+qFBXDwWAggRy0Cu9XIPBIxA6cEQAHpqUYOmiAObaG7UvEE6AAAQATPhSvgACxs-GEQlQfB4tD4fhXYgKDrcEBwaiEjqidiccE8CQ1bDEnKkkDkyk0uloBnMuhYYUcqA8vmC6k6mDYJ25F1aGVUOUKvDK1XqkFgxXs0XQAC0On1huNVNp9KZLOtobFkeonP5f3wAHZqcpgsRw9tlNTUcoYAAPaXQn2K-0QNWI1hAA)

```js
const Ticker = cc(function(){
  let tick = 0
  this.setInterval(() => tick++, 1000)
  return () => m('p', `Tick: ${tick}`)
})
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIAKhGoBrGACdJAXklZ81agAowAVzTViEejoCUwADppJk2FJMK1kgAw27xQhDj44MYgBJYSUANwwoHQs1AD5JJ3kAakSKSQBGV0zzD0klAP0lW2jVOKwdAHIAB3LUgANZBURJABJgBNZa7LRWLptNLFpDYh0AE1pqfRwGfAAjWhGAT1SGxSUuyhpaLEroZTwZjBmYcip-WGNTNAQeAHZEVzYOEEwcPC04AU3hZh42AF0qFAIGh5NdUM8uHgsBAvEpoBsCuQeCRiJU4IgAPQYwyVeQAcy0Wwx0Nh0AAAgAmfCufAAFmJMMIcKg+GhaHw-A2xAWlW4IDg1DhlVE7E4rx4Ejy2ARSiRIBRaMx2LQuIJdCwDNJUEp1LpGMlMGw+uIUs0nKo3N5eAFQpFTxefJJTOgAFptDK5Qr0VicfjCRqncy3dQyTSAJz4G4YkY+YguyYjDHAkYwAAeHM+lr5Nogwv+rCAA)

### React Hooks-like Abstractions

Because CC's `this` has everything you need to manage a component, you can abstract setup and teardown behavior like you would using React hooks.

For example, we can refactor the [MouseEvents](#user-content-addeventlistener) example into its own function:

```js
import {cc} from 'mithril-cc'
import Stream from 'mithril/stream'

const MouseCoords = cc(function(){
  let [$x, $y] = useMouseCoords(this)
  return () => m('p', `Mouse is at ${$x()}, ${$y()}`)
})

function useMouseCoords(ccx) {
  const $x = Stream(0), $y = Stream(0)

  ccx.addEventListener(window, 'mousemove', event => {
    $x(event.offsetX); $y(event.offsetY)
  })

  return [$x, $y]
}
```

[Live demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIAsrQCucGAGFatAE4ATOJIC8krPmrUAFGDlpqxCPWMBKYAB00kybCnIAJAA8KkjwE8AXV1JBRhZMJV1LWNiQgg4WycXNRhiOTVnO10APn1jAHIABwLfAAMIxUkEyQwpD2BvO3Y-Rv9msqS0Vi6nMwsrelDFSuVVTThjIy9bSUdnSXF6rxCDCVTsYwAGW18A1fx1mE2dp2TF6i98DA0NAFEANxEAGQTGNBg1YwB3CDQNWjfXwFLDyRSgp6lSQwJ4MXJzc4uJowkT4WhgMCKYgADVsAG4-O0UQw0RisQBNLouHpnBapdKZSSeHyEwJOVi0gyg8zEYwA6hyHAkgBGtA0-l8oyiEy6lBotCwRWgnzwwowwpg5CoilglmsaAQPAAnIgACxbNgcECYHB4QxwATy4TMHhsQJUKB-ADWhtQ1q4eCwEDiamgcoy5B4JGIRTgiAA9PHzEUvQBzQwK+NBkPQAACACZ8Ft8Kas8HCKGoPgg2h8Pw5cR-EVuCA4NRQ0VROxOLaeEdsOG1JGQNHYwmk2gU+m6FgyzmoAWiyX4-3Z6u647G828G2O12rTaW9mK9AALRGQfD0dxxPJtMZ2fHyvn6i54tG-AAdnjGjep8FGjxn8GgwFc9ZUFuLa7hAnZuqwQA)

### Shorthand Components

If you only need attrs and nothing else, you can use `ccs`.

```js
import {ccs} from 'mithril-cc'

const Greeter = ccs(attrs => (
  m('p', `Hello, ${attrs.name}!`)
)
```

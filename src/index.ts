import m, { Vnode } from 'mithril'
import Stream from 'mithril/stream'

export type ComponentContext<Attrs> = {
  attrs: Stream<Attrs>
  oncreate(f: m.Component<Attrs>['oncreate']): void
  onupdate(f: m.Component<Attrs>['onupdate']): void
  onbeforeupdate(f: m.Component<Attrs>['onbeforeupdate']): void
  onbeforeremove(f: m.Component<Attrs>['onbeforeremove']): void
  setTimeout(f: () => void, ms: number): void
  setInterval(f: () => void, ms: number): void
  addEventListener: Remover['addEventListener']
  /** Write-only */
  unsub: Remover['unsub']
}

export type ComponentDef<Attrs> = (this: ComponentContext<Attrs>, params: Stream<Attrs>) => ShorthandComponent<Attrs>
export type ShorthandComponent<Attrs> = (attrs: Attrs, vnode: Vnode<Attrs>) => Vnode<any,any>

export function cc<Attrs>(init: ComponentDef<Attrs>): m.FactoryComponent<Attrs> {
  return function actualComponent(vnode: m.Vnode<Attrs>) {
    let oncreateHooks = [] as m.Component<Attrs>['oncreate'][]
    let onupdateHooks = [] as m.Component<Attrs>['onupdate'][]

    let oncreate = undefined as undefined | m.Component<Attrs>['oncreate']
    let onupdate = undefined as undefined | m.Component<Attrs>['onupdate']
    let onremove = undefined as undefined | Remover

    let onbeforeupdate = undefined as undefined | m.Component<Attrs>['onbeforeupdate']
    let onbeforeremove = undefined as undefined | m.Component<Attrs>['onbeforeremove']

    function getRemover() {
      return onremove || (onremove = remover())
    }

    const attrs = Stream<Attrs>(vnode.attrs)
    const view = init.call({
      attrs,
      oncreate(f) { oncreate ||= makeHookFn(oncreateHooks); oncreateHooks.push(f) },
      onupdate(f) { onupdate ||= makeHookFn(onupdateHooks); onupdateHooks.push(f) },
      onbeforeupdate(f) { onbeforeupdate = f },
      onbeforeremove(f) { onbeforeremove = f },

      addEventListener(dom, event, handler) {
        getRemover().addEventListener(dom, event, e => { handler(e); m.redraw() })
      },
      setTimeout(f, ms) {
        const timeout = setTimeout(() => { f(); m.redraw() }, ms)
        getRemover().unsub = () => clearTimeout(timeout)
      },
      setInterval(f, ms) {
        const timeout = setInterval(() => { f(); m.redraw() }, ms)
        getRemover().unsub = () => clearTimeout(timeout)
      },
      set unsub(f: any) {
        getRemover().unsub = f
      },
    }, attrs)

    return {
      oncreate,
      onupdate,
      onbeforeupdate,
      onbeforeremove,
      onremove,
      view(vnode: Vnode<Attrs>) {
        attrs(vnode.attrs)
        return view(vnode.attrs, vnode)
      }
    }
  }
}

function makeHookFn(hooks: any[]) {
  return (vnode: Vnode<any>) => hooks.forEach(f => f(vnode))
}

export function ccs<Attrs>(view: ShorthandComponent<Attrs>) {
  return cc<Attrs>(() => view)
}

type Remover = ReturnType<typeof remover>

function remover() {
  let unsubs = [] as Function[]
  const onremove = function onremove() {
    unsubs.forEach(f => f())
  }
  Object.defineProperty(onremove, 'unsub', {
    set(f) {
      unsubs.push(f.constructor === Stream ? () => f.end(true) : f)
    }
  })
  Object.defineProperty(onremove, 'addEventListener', {
    value(dom: Element | Window, event: string, handler: (e: any) => void) {
      dom.addEventListener(event, handler)
      unsubs.push(() => dom.removeEventListener(event, handler))
    },
    writable: false
  })
  return onremove as (() => void) & {
    unsub: () => void
    addEventListener(dom: Element | Window, event: string, handler: (e: any) => void): void
  }
}

//
// Misc helpers
//
export function uniques<T>(eq?: (a: T, b: T) => any) {
  let first = true
  let previous: T | undefined
  return (value: T) => {
    if (first) {
      first = false
      previous = value
      return value
    }
    else if (eq ? eq(value, previous!) : value === previous) {
      return Stream.SKIP
    }
    else {
      previous = value
      return value
    }
  }
}

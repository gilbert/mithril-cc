import m, { Vnode } from 'mithril'
import Stream from 'mithril/stream'

type ComponentContext<Attrs> = {
  oncreate(f: m.Component<Attrs>['oncreate']): void
  onupdate(f: m.Component<Attrs>['onupdate']): void
  onremove: Remover
  addEventListener: Remover['addEventListener']
  /** Write-only */
  unsub: Remover['unsub']
}

type ComponentDef<Attrs> = (this: ComponentContext<Attrs>, params: Stream<Attrs>) => ((attrs: Attrs, vnode: Vnode<Attrs>) => Vnode<any,any>)

export function cc<Attrs>(init: ComponentDef<Attrs>) {
  return function actualComponent(vnode: m.Vnode<Attrs>) {
    let oncreate = undefined as undefined | m.Component<Attrs>['oncreate']
    let onupdate = undefined as undefined | m.Component<Attrs>['onupdate']
    let onremove = undefined as undefined | Remover
    const attrs = Stream<Attrs>(vnode.attrs)
    const view = init.call({
      oncreate(f) { oncreate = f },
      onupdate(f) { onupdate = f },
      get onremove() {
        return onremove || (onremove = remover())
      },
      addEventListener(dom, event, handler) {
        this.onremove.addEventListener(dom, event, handler)
      },
      set unsub(f: any) {
        this.onremove.unsub = f
      },
    }, attrs)

    return {
      oncreate,
      onupdate,
      onremove,
      view(vnode: Vnode<Attrs>) {
        attrs(vnode.attrs)
        return view(vnode.attrs, vnode)
      }
    }
  }
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

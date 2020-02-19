import { SerializedPoint } from '../../Workflow/Types';
type EventHandler = (e: Event) => void;

type Handlers = {
  tap: EventHandler[];
  move: EventHandler[];
  moveEnd: EventHandler[];
  pinch: EventHandler[];
};

type TinyTouch = {
  identifier: number;
  pageX: number;
  pageY: number;
};

export default class EventManager {
  // the element for which we are tracking events
  private el: Element;
  public name: string;
  private debug: boolean = false;
  // keep track of all the event handlers the client sets up
  private handlers: Handlers = {
    tap: [],
    move: [],
    moveEnd: [],
    pinch: []
  };
  // track all active touch events
  private currentTouches: TinyTouch[] = [];
  private startDistance: number;
  private scale = 1;
  private previousScale = 1;
  private isClick = false;
  private isDragging = false;
  private isMouseDown = false;
  private previousCenter: SerializedPoint | null = null;
  private touchIdentifier: number;
  private previousLocation: SerializedPoint | null;
  private delta: SerializedPoint;
  private previousDelta: SerializedPoint;

  constructor(element: Element) {
    this.el = element;
    this.name = element.id || element.tagName;

    if (this.debug) console.log(`EventManager(${this.name})`);

    this.setup();
  }

  setup = () => {
    if ('ontouchstart' in window) {
      this.el.addEventListener('touchstart', this._mousedown.bind(this));
    } else {
      this.el.addEventListener('mousedown', this._mousedown.bind(this));
    }
  };

  setdown = () => {
    if ('ontouchstart' in window) {
      this.el.removeEventListener('touchstart', this._mousedown.bind(this));
      this.el.removeEventListener('touchstart', this._pinchStart.bind(this));
      this.el.removeEventListener('touchend', this._pinchEnd.bind(this));
      this.el.removeEventListener('touchcancel', this._pinchCancel.bind(this));
      this.el.removeEventListener('touchmove', this._pinchMove.bind(this));
    } else {
      this.el.removeEventListener('mousedown', this._mousedown.bind(this));
    }
  };

  // Distance is used to calc the scale. This saves the starting distance
  _setStartDistance = () => {
    if (this.currentTouches.length >= 2) {
      const [first, second] = this.currentTouches;
      this.startDistance = this._distance(first, second);
    }
  };

  // When a finger touches the screen:
  // - make a small version copy of the event
  // - save it
  // - recalc the starting distance just in case (is this needed?)
  _pinchStart = (e: TouchEvent) => {
    e.preventDefault();
    const touches = e.changedTouches;
    for (const touch of Array.from(touches)) {
      const { identifier, pageX, pageY } = touch;
      this.currentTouches.push({ identifier, pageX, pageY });
    }
    this._setStartDistance();
  };

  // When a finger is lifted:
  // - remove the event from currenTouches
  // - save the scale if we're done (less than 2 touches)
  // - clear the saved center point (used for 2 finger panning)
  _pinchEnd = (e: TouchEvent) => {
    e.preventDefault();

    for (const finishedTouch of Array.from(e.changedTouches)) {
      const idx = this.currentTouches.findIndex(
        (t: Touch) => t.identifier === finishedTouch.identifier
      );

      if (idx == -1) return;
      this.currentTouches.splice(idx, 1);
    }
    this._setStartDistance();
    if (this.currentTouches.length < 2) {
      this.previousScale = this.scale;
    }
    this.previousCenter = null;
  };

  _pinchCancel = e => {
    e.preventDefault();
    // TODO
  };

  // The touches from the event are not order guaranteed
  // so we need to get the first two touches based on the order
  // saved in currentTouches array
  // - this.scale tracks the scale-in-progress, while this.previousScale is where it's
  //   saved once you let go
  // - center is calculated so we can also pan the canvas while scaling
  // - previousCenter is tracked so we can create the delta object needed for panning
  _pinchMove = e => {
    e.preventDefault();
    if (e.changedTouches.length < 2) {
      return;
    }

    const touches: Touch[] = Array.from(e.touches);
    const first = touches.find(
      (t: Touch) => t.identifier === this.currentTouches[0].identifier
    );
    const second = touches.find(
      (t: Touch) => t.identifier === this.currentTouches[1].identifier
    );

    if (!first || !second) return;

    const newDistance = this._distance(first, second);

    this.scale = (this.previousScale * newDistance) / this.startDistance;

    const center:SerializedPoint = {
      x: (first.pageX + second?.pageX) / 2,
      y: (first.pageY + second.pageY) / 2
    };

    if (!this.previousCenter) {
      this.previousCenter = center;
    }

    const obj = {
      detail: {
        x: center.x,
        y: center.y,
        scale: this.scale,
        delta: {
          x: center.x - this.previousCenter.x,
          y: center.y - this.previousCenter.y
        }
      }
    };

    const customEvent = new CustomEvent('pinch', obj);
    this.callHandler('pinch', customEvent);

    this.previousCenter = center;
  };

  setupPinch = () => {
    this.el.addEventListener('touchstart', this._pinchStart.bind(this));
    this.el.addEventListener('touchend', this._pinchEnd.bind(this));
    this.el.addEventListener('touchcancel', this._pinchCancel.bind(this));
    this.el.addEventListener('touchmove', this._pinchMove.bind(this));
  };

  _distance = (touch1: Touch | TinyTouch, touch2: Touch | TinyTouch) => {
    const first = {
      x: touch1.pageX,
      y: touch1.pageY
    };
    const second = {
      x: touch2.pageX,
      y: touch2.pageY
    };
    const a = Math.abs(first.x - second.x);
    const b = Math.abs(first.y - second.y);
    const d = Math.sqrt(a ** 2 + b ** 2);

    return d;
  };

  debugEvent = (e: TouchEvent | MouseEvent) => {
    if (this.debug) console.log(`${this.name} : ${e.type}`, e);
  };

  addHandler = (eventName: string, fn: EventHandler) => {
    this.handlers[eventName].push(fn);
  };

  callHandler = (eventName: string, event: CustomEvent) => {
    if (this.handlers[eventName].length) {
      this.handlers[eventName].forEach(fn => fn(event));
    }
  };

  _mousedown = (e: TouchEvent | MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.debugEvent(e);

    // Ignore multiple touches
    if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 1)
      return;
    // Add listeners
    if ('ontouchstart' in window) {
      window.addEventListener('touchmove', this._mousemove);
      window.addEventListener('touchend', this._mouseup);
    } else {
      window.addEventListener('mousemove', this._mousemove);
      window.addEventListener('mouseup', this._mouseup);
    }

    this.isMouseDown = true;
    this.isClick = true;
    if (window.TouchEvent && e instanceof TouchEvent) {
      this.touchIdentifier = e.changedTouches?.[0].identifier;
    }
  };

  _getEvent = (e: TouchEvent | MouseEvent): Touch | MouseEvent => {
    if (window.TouchEvent && e instanceof TouchEvent) {
      let event = Array.from(e.touches).find(
        (t: Touch) => t.identifier === this.touchIdentifier
      );
      if (!event) {
        event = Array.from(e.changedTouches).find(
          (t: Touch) => t.identifier === this.touchIdentifier
        );
      }
      if (!event) {
        throw new Error(`Event not found. Shouldn't have ended up here`);
      }

      return event;
    } else {
      return e as MouseEvent;
    }
  };

  _mousemove = (e: TouchEvent | MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 1)
      return;

    if (!this.isMouseDown) return;

    this.debugEvent(e);

    // get touch or click from either mouse or touch
    const touchOrClick = this._getEvent(e);
    if (!touchOrClick) return;

    if (!this.previousLocation) {
      this.previousLocation = { x: touchOrClick.pageX, y: touchOrClick.pageY };
    }

    this.delta = {
      x: touchOrClick.pageX - this.previousLocation.x,
      y: touchOrClick.pageY - this.previousLocation.y
    };

    // If we're not already dragging and the delta is 0 or 1, treat as possible click
    // (isClick evaluates on mouseUp, so it could be reset if mouse moves a bit more
    //  and delta increases)
    if (
      !this.isDragging &&
      Math.abs(this.delta.x) <= 1 &&
      Math.abs(this.delta.y) <= 1
    ) {
      this.isClick = true;
      return;
    }

    // If we are here, we must be dragging...
    this.isDragging = true;
    this.isClick = false;

    if (!this.previousDelta) {
      this.previousDelta = this.delta;
    }

    const customEvent = new CustomEvent('move', {
      detail: {
        x: touchOrClick.pageX,
        y: touchOrClick.pageY,
        delta: this.delta
      }
    });

    this.previousLocation = { x: touchOrClick.pageX, y: touchOrClick.pageY };
    this.previousDelta = this.delta;

    this.callHandler('move', customEvent);
  };

  _mouseup = (e: TouchEvent | MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if ('ontouchstart' in window) {
      window.removeEventListener('touchmove', this._mousemove);
      window.removeEventListener('touchend', this._mouseup);
    } else {
      window.removeEventListener('mousemove', this._mousemove);
      window.removeEventListener('mouseup', this._mouseup);
    }

    // Ignore 2nd, 3rd, etc.. fingers' 'touchend'
    if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 1)
      return;

    if (!this.isMouseDown) return;

    this.debugEvent(e);
    this.isMouseDown = false;
    this.previousLocation = null;

    const event = this._getEvent(e);

    // This was a click, trigger 'tap'
    if (this.isClick) {
      const customEvent = new CustomEvent('tap', {
        detail: {
          x: event.pageX,
          y: event.pageY
        }
      });
      this.callHandler('tap', customEvent);
    }

    // This was a 'move', trigger 'moveend'
    if (this.isDragging && !this.isClick) {
      const customEvent = new CustomEvent('moveEnd', {
        detail: {
          x: event.pageX,
          y: event.pageY,
          delta: this.delta
        }
      });
      this.callHandler('moveEnd', customEvent);
    }

    this.delta = this.previousDelta = { x: 0, y: 0 };
    this.isClick = false;
    this.isDragging = false;
  };

  onTap = (fn: EventHandler) => {
    this.addHandler('tap', fn);
  };

  onMove = (fn: EventHandler) => {
    this.addHandler('move', fn);
  };

  onMoveEnd = (fn: EventHandler) => {
    this.addHandler('moveEnd', fn);
  };

  onPinch = (fn: EventHandler) => {
    this.setupPinch();
    this.addHandler('pinch', fn);
  };
}

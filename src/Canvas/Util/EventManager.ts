// @ts-nocheck

export default class EventManager {
  constructor(element, data?) {
    this.el = element;
    this.data = data;
    this.name = element.id || element.tagName;
    this.debug = false;
    this.handlers = {
      tap: [],
      move: [],
      moveEnd: [],
      pinch: []
    };
    this.isClick = false;
    this.isDragging = false;
    if (this.debug) console.log(`EventManager(${this.name})`);

    this.setup();
    this._mousemove = this._mousemove.bind(this);
    this._mouseup = this._mouseup.bind(this);
    this.currentTouches = [];
    this.scale = 1;
    this.previousScale = 1;
    this.previousCenter = undefined;
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
    } else {
      this.el.removeEventListener('mousedown', this._mousedown.bind(this));
    }
  };

  _setStartDistance = () => {
    if (this.currentTouches.length >= 2) {
      const [first, second] = this.currentTouches;
      this.startDistance = this._distance(first, second);
    }
  };

  _pinchStart = e => {
    e.preventDefault();
    const touches = e.changedTouches;
    for (const touch of touches) {
      // console.log(`START: ${touch.identifier}`);
      const { identifier, pageX, pageY } = touch;
      this.currentTouches.push({ identifier, pageX, pageY });
    }
    this._setStartDistance();
  };

  _pinchEnd = e => {
    e.preventDefault();

    for (const finishedTouch of e.changedTouches) {
      // console.log(`END: ${finishedTouch.identifier}`);
      const idx = this.currentTouches.findIndex(
        t => t.identifier === finishedTouch.identifier
      );

      if (idx == -1) return;
      this.currentTouches.splice(idx, 1);
    }
    this._setStartDistance();
    if (this.currentTouches.length < 2) {
      this.previousScale = this.scale;
    }
    this.previousCenter = undefined;
  };

  _pinchCancel = e => {
    e.preventDefault();
    // for (const finishedTouch of e.changedTouches) {
    //   console.log(`CANCELLED: ${finishedTouch.identifier}`);
    //   // const idx = this.currentTouches.findIndex(
    //   //   t => t.identifier === finishedTouch.identifier
    //   // );
    //   // this.currentTouches.splice(idx, 1);
    // }
    // // this._setStartDistance();
    // // if (this.currentTouches.length < 2) {
    // //   this.previousScale = this.scale;
    // // }
    // // this.previousCenter = undefined;
  };

  _pinchMove = e => {
    e.preventDefault();
    if (e.changedTouches.length < 2) {
      return;
    }

    const touches = Array.from(e.touches);
    const first = touches.find(
      t => t.identifier === this.currentTouches[0].identifier
    );
    const second = touches.find(
      t => t.identifier === this.currentTouches[1].identifier
    );

    // console.log(`1: ${first.identifier}: (${first.clientX}x${first.clientY}  -  ${second.identifier}: (${second.clientX}x${second.clientY})`);
    // console.log(`2: ${first.identifier}: (${first.clientX}x${first.clientY}  -  ${second.identifier}: (${second.clientX}x${second.clientY})`);
    const newDistance = this._distance(first, second);

    this.scale = (this.previousScale * newDistance) / this.startDistance;

    const center = {
      x: (first.pageX + second.pageX) / 2,
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

  _distance = (obj1, obj2) => {
    if (!obj1) throw new Error('Missing obj1');
    if (!obj2) throw new Error('Missing obj2');
    const first = {
      x: obj1.pageX ?? obj1.x,
      y: obj1.pageY ?? obj1.y
    };
    const second = {
      x: obj2.pageX ?? obj2.x,
      y: obj2.pageY ?? obj2.y
    };
    const a = Math.abs(first.x - second.x);
    const b = Math.abs(first.y - second.y);
    const d = Math.sqrt(a ** 2 + b ** 2);

    if (isNaN(d)) debugger;
    return d
  };

  debugEvent = e => {
    if (this.debug) console.log(`${this.name} : ${e.type}`, e);
  };

  addHandler = (eventName, fn) => {
    this.handlers[eventName].push(fn);
  };

  callHandler = (eventName, event) => {
    if (this.handlers[eventName].length) {
      if (this.data) {
        event.data = this.data;
      }
      this.handlers[eventName].forEach(fn => fn(event));
    }
  };

  getEvent = e => {
    if (e.targetTouches) {
      let event = Array.from(e.touches).find(
        t => t.identifier === this.touchId
      );
      if (!event) {
        event = Array.from(e.changedTouches).find(
          t => t.identifier === this.touchId
        );
      }
      return event;
    } else {
      return e;
    }
  };

  _mousedown = event => {
    event.preventDefault();
    event.stopPropagation();
    this.debugEvent(event);

    // Ignore multiple touches
    if (event.touches && Array.from(event.touches).length > 1) return;

    // Add listeners
    if ('ontouchstart' in window) {
      window.addEventListener('touchmove', this._mousemove);
      window.addEventListener('touchend', this._mouseup);
    } else {
      window.addEventListener('mousemove', this._mousemove);
      window.addEventListener('mouseup', this._mouseup);
    }

    this.mouseDown = true;
    this.isClick = true;
    this.touchId = event.changedTouches
      ? event.changedTouches[0].identifier
      : undefined;
  };

  _mousemove = rawEvent => {
    rawEvent.preventDefault();
    rawEvent.stopPropagation();
    if (rawEvent.touches && rawEvent.touches.length > 1) return;

    if (!this.mouseDown) return;

    this.debugEvent(rawEvent);

    // get event from either mouse or touch
    const event = this.getEvent(rawEvent);
    if (!event) return;

    if (!this.prevLoc) {
      this.prevLoc = { x: event.pageX, y: event.pageY };
    }

    this.delta = {
      x: event.pageX - this.prevLoc.x,
      y: event.pageY - this.prevLoc.y
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

    if (!this.prevDelta) {
      this.prevDelta = this.delta;
    }

    const customEvent = new CustomEvent('move', {
      detail: {
        x: event.pageX,
        y: event.pageY,
        delta: this.delta
      }
    });

    this.prevLoc = { x: event.pageX, y: event.pageY };
    this.prevDelta = this.delta;

    this.callHandler('move', customEvent);
  };

  _mouseup = rawEvent => {
    rawEvent.preventDefault();
    rawEvent.stopPropagation();

    if ('ontouchstart' in window) {
      window.removeEventListener('touchmove', this._mousemove);
      window.removeEventListener('touchend', this._mouseup);
    } else {
      window.removeEventListener('mousemove', this._mousemove);
      window.removeEventListener('mouseup', this._mouseup);
    }

    // Ignore 2nd, 3rd, etc.. fingers' 'touchend'
    if (rawEvent.touches && Array.from(rawEvent.touches).length > 0) return;
    if (!this.mouseDown) return;
    this.debugEvent(rawEvent);

    this.mouseDown = false;
    this.prevLoc = null;

    const event = rawEvent.changedTouches
      ? rawEvent.changedTouches[0].identifier
      : rawEvent;

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
          delta: this.delta,
          rawEvent: event
        }
      });
      this.callHandler('moveEnd', customEvent);
    }

    this.delta = this.prevDelta = { x: 0, y: 0 };
    this.isClick = false;
    this.isDragging = false;
  };

  onTap = fn => {
    this.addHandler('tap', fn);
  };

  onMove = fn => {
    this.addHandler('move', fn);
  };

  onMoveEnd = fn => {
    this.addHandler('moveEnd', fn);
  };

  onPinch = fn => {
    this.setupPinch();
    this.addHandler('pinch', fn);
  };
}

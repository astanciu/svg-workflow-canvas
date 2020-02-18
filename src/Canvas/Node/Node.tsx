import isEqual from 'lodash/isEqual';
import React from 'react';
import ReactDOM from 'react-dom';
import { Node, Point } from '../Models';
import EventManager from '../Util/EventManager.js';
import { NodeTitle } from './NodeTitle';
import { Shape } from './Shape';
import { ShapeEnd } from './ShapeEnd';
import { ShapeStart } from './ShapeStart';

type Props = {
  node: Node;
  updateNode: any;
  selectedNode: Node | null;
  selectNode: (node: Node | null) => void;
  canvasView: any;
  onConnectionDrag: any;
  onConnectionEnd: any;
  snapToGrid: boolean;
  connectionCandidate: boolean;
};

class NodeComponent extends React.Component<Props> {
  static displayName = 'Node';
  static defaultProps = {
    snapToGrid: true
  };
  state = {};
  private dragging = false;
  private domNode: Element | Text | null = null;
  private em!: EventManager;

  componentDidMount() {
    this.domNode = ReactDOM.findDOMNode(this);

    this.em = new EventManager(this.domNode);
    this.em.onTap(this._onTap);
    this.em.onMove(this._onMove);

    this.em.onMoveEnd(this._onMoveEnd);
    this.snapToGrid();
  }

  componentWillUnmount() {
    this.em.setdown();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const sameProps = isEqual(nextProps, this.props);
    const sameState = isEqual(nextState, this.state);
    const shouldUpdate = !(sameProps && sameState);

    return shouldUpdate;
  }

  _onTap = e => {
    e.stopPropagation();
    const node = new Node(this.props.node);
    this.props.selectNode(node);
  };

  _onMove = e => {
    e.stopPropagation();
    this.dragging = true;

    const node = this.props.node.clone();
    const scaleFactor =
      (this.props.canvasView && this.props.canvasView.scale) || 1;
    node.position = new Point(
      node.position.x + (e.detail.delta.x * 1) / scaleFactor,
      node.position.y + (e.detail.delta.y * 1) / scaleFactor
    );

    this.props.updateNode(node);
  };

  _onMoveEnd = () => {
    this.dragging = false;
    this.snapToGrid();
  };

  snapToGrid = () => {
    if (!this.props.snapToGrid) {
      // hacky, need it because this.dragging and pointer styles
      this.setState({ forceUpdate: Math.random() });
      return;
    }

    const node = new Node(this.props.node);
    const hgrid = 100 * 0.5;
    const vgrid = 110 * 0.75;
    const target = {
      x: Math.round(node.position.x / hgrid) * hgrid,
      y: Math.round(node.position.y / vgrid) * vgrid
    };

    node.position = new Point(target.x, target.y);
    this.props.updateNode(node);
  };

  getTransform = () => {
    const loc = {
      x: this.props.node.position.x,
      y: this.props.node.position.y
    };
    return `translate(${loc.x},${loc.y})`;
  };

  render() {
    let selected = false;
    let unselected = false;
    if (this.props.selectedNode) {
      selected = this.props.selectedNode.id === this.props.node.id;
      unselected = this.props.selectedNode.id !== this.props.node.id;
    }

    let dragStyle = {
      cursor: 'inherit'
    };

    let ShapeComponent = Shape;
    if (this.props.node.id === 'START') {
      ShapeComponent = ShapeStart;
    }
    if (this.props.node.id === 'END') {
      ShapeComponent = ShapeEnd;
    }

    return (
      <g id="Node" transform={this.getTransform()} style={dragStyle}>
        <ShapeComponent
          node={this.props.node}
          selected={selected}
          unselected={unselected}
          // @ts-ignore
          dragging={this.dragging}
          onConnectionDrag={this.props.onConnectionDrag}
          onConnectionEnd={this.props.onConnectionEnd}
          connectionCandidate={this.props.connectionCandidate}
        />
        <NodeTitle node={this.props.node} unselected={unselected} />
      </g>
    );
  }
}

export default NodeComponent;

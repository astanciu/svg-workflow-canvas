import isEqual from 'lodash/isEqual';
import React from 'react';
import ReactDOM from 'react-dom';
// import { connect } from 'react-redux';
// import { selectNode } from 'ReduxState/actions';
import Icon from '../Icon/Icon';
import { Node, Point } from '../Models';
import EventManager from '../Util/EventManager.js';
import styles from './Node.module.css';
import { NodeTitle } from './NodeTitle';
import { InPort, OutPort } from './Ports';

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

    // if (this.props.snapToGrid) this.em.onMoveEnd(this._onMoveEnd);
    this.em.onMoveEnd(this._onMoveEnd);
    this.snapToGrid();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const sameProps = isEqual(nextProps, this.props);
    const sameState = isEqual(nextState, this.state);
    const shouldUpdate = !(sameProps && sameState);

    return shouldUpdate;
    // return true;
  }

  _onTap = e => {
    e.stopPropagation();
    const node = new Node(this.props.node);
    this.props.selectNode(node);
  };

  _onMove = e => {
    e.stopPropagation();
    this.dragging = true;

    const node = new Node(this.props.node);
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
    if (!this.props.snapToGrid){
      // hacky, need it because this.dragging and pointer styles
      this.setState({forceUpdate: Math.random()})
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

    let nodeClass = styles.normal;
    let nodeOutline = styles.normalOutline;
    let nodeIconClass = styles.normalIcon;

    if (unselected) {
      nodeClass = styles.unselected;
      nodeOutline = styles.unselectedOutline;
      nodeIconClass = styles.unselectedIcon;
    }

    if (selected) {
      nodeClass = styles.selected;
      nodeOutline = styles.selectedOutline;
      nodeIconClass = styles.selectedIcon;
    }

    let dragStyle = {
      cursor: 'inherit'
    };

    if (this.dragging) {
      nodeClass += ' ' + styles.nocursor;
      nodeIconClass += ' ' + styles.nocursor;
    }

    const w = 80;
    const h = 79;
    const scale = this.props.node.scale;

    return (
      <g id="Node" transform={this.getTransform()} style={dragStyle}>
        {/* <g id="Hexgons" transform="translate(-40.000000, -39.500000) "> */}
        <g
          id="Hexgons"
          transform={`translate(-${(w * scale) / 2}, -${(h * scale) /
            2}) scale(${scale})`}
        >
          <polygon
            className={nodeOutline}
            strokeWidth="1"
            points="40 0 74.6410162 19.75 74.6410162 59.25 40 79 5.35898385 59.25 5.35898385 19.75"
          />
          <polygon
            className={nodeClass}
            points="40 5 70.3108891 22.25 70.3108891 56.75 40 74 9.68911087 56.75 9.68911087 22.25"
          />
        </g>

        <Icon
          icon={this.props.node.icon}
          className={nodeIconClass}
          size={28 * scale}
        />

        <g id="Ports" transform={`translate(${0},${0})`}>
          <OutPort
            node={this.props.node}
            onConnectionDrag={this.props.onConnectionDrag}
            onConnectionEnd={this.props.onConnectionEnd}
            unselected={unselected}
          />
          <InPort
            node={this.props.node}
            highlight={this.props.connectionCandidate}
            unselected={unselected}
          />
        </g>
        <NodeTitle node={this.props.node} unselected={unselected} />
      </g>
    );
  }
}
export default NodeComponent;

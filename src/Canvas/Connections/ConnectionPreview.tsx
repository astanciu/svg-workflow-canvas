import React from 'react';
import { Node, Point } from '../Models';
import styles from './Connections.module.scss';
import { makeSVGPath } from './util';

type Props = {
  startNode: Node;
  mouse: Point;
};

const ConnectionPreview = ({ startNode, mouse }: Props) => {
  const { path } = makeSVGPath(startNode.outPortPosition, mouse);

  return <path d={path} className={styles.previewConnection} />;
};

export default ConnectionPreview;

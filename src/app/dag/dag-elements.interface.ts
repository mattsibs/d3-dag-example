export interface DagEdgePoint {
  id: any;
  x: number;
  y: number;
}

export interface DagNode {
  id: any;
  radius: number;
  x: number;
  y: number;
}

export interface DagArrow {
  id: any;
  d: string;
  angle: number;
  scale: number;
  x: number;
  y: number;
}

export interface DagEdge {
  d: string;
  source: DagEdgePoint;
  target: DagEdgePoint;
}

export interface DagElements {
  edges: DagEdge[];
  nodes: DagNode[];
  arrows: DagArrow[];
  colorMap: {};
}


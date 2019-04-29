import {Injectable} from '@angular/core';
import * as d3Dag from 'd3-dag/index.js';
import * as d3Shapes from 'd3-shape';
import * as d3 from 'd3';
import {DagArrow, DagEdge, DagElements, DagNode} from './dag-elements.interface';


@Injectable({
  providedIn: 'root'
})
export class DagService {
  private edgeStrokeWidth = 0.2;
  private arrowStrokeWidth = 0.1;

  createGraph(edges: string[][]): DagElements {
    const nodeRadius = 2;
    const nodeSeparation = nodeRadius * 20;

    const dagConnect = d3Dag.dagConnect()(edges);
    const dag = d3Dag.sugiyama()(dagConnect);

    const line = d3.line<any>()
      .curve(d3Shapes.curveCatmullRom)
      .x(d => nodeSeparation * d.x)
      .y(d => nodeSeparation * d.y);

    return {
      nodes: this.extractNodes(dag, nodeSeparation, nodeRadius),
      edges: this.extractEdges(dag, line),
      arrows: this.extractArrows(nodeRadius, dag, nodeSeparation),
      colorMap: this.createColorMap(dag)
    };
  }

  private extractArrows(nodeRadius: number, dag, nodeSeparation) {
    const arrow = d3.symbol().type(d3Shapes.symbolTriangle)
      .size(nodeRadius * nodeRadius / 5.0);

    const links = dag.links();
    const arrows: DagArrow[] = [];
    for (const link of links) {
      const data = link.data;
      const [end, start] = data.points.reverse();

      const adjustedStartX = start.x * nodeSeparation;
      const adjustedStartY = start.y * nodeSeparation;
      const adjustedEndX = end.x * nodeSeparation;
      const adjustedEndY = end.y * nodeSeparation;

      // This sets the arrows the node radius (20) + a little bit (3) away from the node center,
      // on the last line segment of the edge. This means that edges that only span ine level will
      // work perfectly, but if the edge bends, this will be a little off.

      const dx = (adjustedStartX - adjustedEndX);
      const dy = (adjustedStartY - adjustedEndY);
      const scale = nodeRadius * 1.15 / Math.sqrt(dx * dx + dy * dy);

      // This is the angle of the last line segment
      const angle = Math.atan2(-dy, -dx) * 180 / Math.PI + 90;

      arrows.push({
        id: link.target.id,
        d: arrow(),
        scale,
        angle,
        x: adjustedEndX + dx * scale,
        y: adjustedEndY + dy * scale,
      });
    }
    return arrows;
  }

  private extractNodes(dag, nodeSeparation, nodeRadius: number) {
    const nodes: DagNode[] = [];
    const descendants: any[] = dag.descendants();

    for (const descendant of descendants) {

      nodes.push({
        id: descendant.id,
        x: descendant.x * nodeSeparation,
        y: descendant.y * nodeSeparation,
        radius: nodeRadius
      });
    }
    return nodes;
  }

  private createColorMap(dag) {
    const steps = dag.size();
    const interp = d3.interpolateRainbow;
    const colorMap = {};
    dag.each((node, i) => {
      colorMap[node.id] = interp(i / steps);
    });
    return colorMap;
  }

  private extractEdges(dag, line) {
    const links: any[] = dag.links();
    const dagEdges: DagEdge[] = [];

    for (const link of links) {
      const data = link.data;
      const source = link.source;
      const target = link.target;

      dagEdges.push({
        d: line(data.points),
        source: {
          id: source.id,
          x: source.x,
          y: source.y
        },
        target: {
          id: target.id,
          x: target.x,
          y: target.y
        }
      });
    }
    return dagEdges;
  }

}

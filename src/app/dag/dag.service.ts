import {Injectable} from '@angular/core';
import * as d3Dag from 'd3-dag/index.js';
import {Selection} from 'd3-selection';
import * as d3Shapes from 'd3-shape';
import * as d3 from 'd3';


@Injectable({
  providedIn: 'root'
})
export class DagService {
  createGraphFromConnections(width: number, height: number, chartContainer: Selection<any, any, HTMLElement, any>): void {
    console.log(chartContainer);
    const nodeRadius = 10;
    const nodeSeparation = 100;

    const dagConnect = d3Dag.dagConnect()([['a', 'b'], ['b', 'c'], ['a', 'z'], ['b', 'y'], ['c', 'x'], ['c', 'y']]);
    const dag = d3Dag.sugiyama()(dagConnect);

    console.log(dag);
    chartContainer.attr('viewbox', `${-nodeRadius} ${-nodeRadius} ${width + 2 * nodeRadius} ${height + 2 * nodeRadius}`);

    const line = d3.line<any>()
      .curve(d3Shapes.curveCatmullRom)
      .x(d => d.x)
      .y(d => d.y);

    chartContainer
      .append('g')
      .selectAll('path')
      .data(dag.links())
      .enter()
      .append('path')
      .attr('d', ({data}) => line(data.points))
      .attr('transform', ({
                            source,
                            target,
                            data
                          }) => {
        const [end, start] = data.points;

        const adjustedStartX = start.x * nodeSeparation + nodeRadius;
        const adjustedStartY = start.y * nodeSeparation + nodeRadius;
        const adjustedEndX = end.x * nodeSeparation + nodeRadius;
        const adjustedEndY = end.y * nodeSeparation + nodeRadius;
        // This sets the arrows the node radius (20) + a little bit (3) away from the node center,
        // on the last line segment of the edge. This means that edges that only span ine level will
        // work perfectly, but if the edge bends, this will be a little off.
        const dx = (adjustedStartX - adjustedEndX);
        const dy = (adjustedStartY - adjustedEndY);
        const scale = nodeRadius * 1.15 / Math.sqrt(dx * dx + dy * dy);
        return `translate(${adjustedEndX + dx * scale}, ${adjustedEndY + dy * scale})`;
      })
      .attr('fill', 'none')
      .attr('stroke-width', 3)
      .attr('stroke', 'black');

    const nodes = chartContainer.append('g')
      .selectAll('g')
      .data(dag.descendants())
      .enter()
      .append('g')
      .attr('transform', ({x, y}) => {
        return `translate(${(x * nodeSeparation + nodeRadius)}, ${y * nodeSeparation + nodeRadius})`;
      });


    nodes.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', 'red');


    const arrow = d3.symbol().type(d3Shapes.symbolTriangle)
      .size(nodeRadius * nodeRadius / 5.0);
    chartContainer.append('g')
      .selectAll('path')
      .data(dag.links())
      .enter()
      .append('path')
      .attr('d', arrow)
      .attr('transform', ({
                            source,
                            target,
                            data
                          }) => {
        const [end, start] = data.points.reverse();

        const adjustedStartX = start.x * nodeSeparation + nodeRadius;
        const adjustedStartY = start.y * nodeSeparation + nodeRadius;
        const adjustedEndX = end.x * nodeSeparation + nodeRadius;
        const adjustedEndY = end.y * nodeSeparation + nodeRadius;
        // This sets the arrows the node radius (20) + a little bit (3) away from the node center,
        // on the last line segment of the edge. This means that edges that only span ine level will
        // work perfectly, but if the edge bends, this will be a little off.
        const dx = (adjustedStartX - adjustedEndX);
        const dy = (adjustedStartY - adjustedEndY);
        const scale = nodeRadius * 1.15 / Math.sqrt(dx * dx + dy * dy);
        // This is the angle of the last line segment
        const angle = Math.atan2(-dy, -dx) * 180 / Math.PI + 90;
        return `translate(${adjustedEndX + dx * scale}, ${adjustedEndY + dy * scale}) rotate(${angle})`;
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);

  }
}

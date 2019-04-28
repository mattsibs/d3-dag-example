import {Injectable} from '@angular/core';
import * as d3Dag from 'd3-dag/index.js';
import {Selection} from 'd3-selection';
import * as d3Shapes from 'd3-shape';
import * as d3 from 'd3';


@Injectable({
  providedIn: 'root'
})
export class DagService {
  private edgeStrokeWidth = 0.2;
  private arrowStrokeWidth = 0.1;

  createGraphFromConnections(width: number, height: number, chartContainer: Selection<any, any, HTMLElement, any>, edges): void {
    const nodeRadius = 2;
    const nodeSeparation = 20;

    const dagConnect = d3Dag.dagConnect()(edges);
    const dag = d3Dag.sugiyama()(dagConnect);


    console.log(dag);
    chartContainer.attr('viewBox', `${-nodeRadius} ${-nodeRadius} ${width + 2 * nodeRadius} ${height + 2 * nodeRadius}`);

    const line = d3.line<any>()
      .curve(d3Shapes.curveCatmullRom)
      .x(d => nodeSeparation * d.x)
      .y(d => nodeSeparation * d.y);


    const defs = chartContainer.append('defs');

    const steps = dag.size();
    const interp = d3.interpolateRainbow;
    const colorMap = {};
    dag.each((node, i) => {
      colorMap[node.id] = interp(i / steps);
    });

    chartContainer
      .append('g')
      .selectAll('path')
      .data(dag.links())
      .enter()
      .append('path')
      .attr('d', ({data}) => line(data.points))
      .attr('fill', 'none')
      .attr('stroke-width', this.edgeStrokeWidth)
      .attr('stroke', ({source, target}) => {
      const gradId = `${source.id}-${target.id}`;
      const grad = defs.append('linearGradient')
        .attr('id', gradId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', source.x)
        .attr('x2', target.x)
        .attr('y1', source.y)
        .attr('y2', target.y);
      grad.append('stop').attr('offset', '0%').attr('stop-color', colorMap[source.id]);
      grad.append('stop').attr('offset', '100%').attr('stop-color', colorMap[target.id]);
      return `url(#${gradId})`;
    });

    const nodes = chartContainer.append('g')
      .selectAll('g')
      .data(dag.descendants())
      .enter()
      .append('g')
      .attr('transform', ({x, y}) => `translate(${nodeSeparation * x}, ${nodeSeparation * y})`);


    nodes.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', n => colorMap[n.id]);


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
        return `translate(${adjustedEndX + dx * scale}, ${adjustedEndY + dy * scale}) rotate(${angle})`;
      })
      .attr('fill', ({target}) => colorMap[target.id])
      .attr('stroke', 'white')
      .attr('stroke-width', this.arrowStrokeWidth);

  }
}

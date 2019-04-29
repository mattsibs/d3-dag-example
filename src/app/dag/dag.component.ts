import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DagService} from './dag.service';
import {DagArrow, DagEdge, DagNode} from './dag-elements.interface';

@Component({
  selector: 'app-dag',
  templateUrl: 'dag.component.html'
})
export class DagComponent implements OnInit, OnChanges {

  dagEdges: DagEdge[];
  dagNodes: DagNode[];
  dagArrows: DagArrow[];
  colorMap = {};

  inputEdges = [
    ['a', 'b'],
    ['q', 'b'],
    ['a', 'z'],
    ['a', 'y'],
    ['b', 'c'],
    ['b', 'y'],
    ['c', 'x'],
    ['c', 'y'],
    ['b', 'd'],
    ['d', 'e'],
    ['d', 'f'],
    ['e', 'f']];

  constructor(public dagService: DagService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    const dagElements = this.dagService.createGraph(this.inputEdges);
    this.dagEdges = dagElements.edges;
    this.dagNodes = dagElements.nodes;
    this.dagArrows = dagElements.arrows;
    this.colorMap = dagElements.colorMap;
  }
}

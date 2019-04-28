import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import * as d3 from 'd3';
import {Selection} from 'd3';
import {DagService} from './dag.service';

@Component({
  selector: 'app-dag',
  templateUrl: 'dag.component.html'
})
export class DagComponent implements OnInit, OnChanges {

  edges = [
    ['a', 'b'],
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
    const test: Selection<any, any, HTMLElement, any> = d3.select('#dag');
    this.dagService.createGraphFromConnections(100, 100, test, this.edges);
  }


}

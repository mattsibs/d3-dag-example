import {NgModule} from '@angular/core';
import {DagComponent} from './dag.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [DagComponent],
  exports: [DagComponent]
})
export class DagModule {
}

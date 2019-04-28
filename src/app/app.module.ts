import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DagModule} from './dag/dag.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DagModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

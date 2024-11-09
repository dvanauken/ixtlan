import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { IxtTableModule } from './components/ixt-table/ixt-table.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IxtTableModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
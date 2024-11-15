// app.module.ts modifications
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { IxtTableModule } from '../components/ixt-table/ixt-table.module';
import { IxtTabsetModule } from '../components/ixt-tabset/ixt-tabset.module';
import { IxtHolyGrailModule } from '../components/ixt-holy-grail/ixt-holy-grail.module';
import { IxtDialogModule } from '../components/ixt-dialog/ixt-dialog.module';
import { IxtLayerManagerModule } from '../components/ixt-layer-manager/ixt-layer-manager.module'; // Add this
import { IxtTreeModule } from '../components/ixt-tree/ixt-tree.module'; // Add this

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // Add this
    IxtTableModule,
    IxtTabsetModule,
    IxtHolyGrailModule,
    IxtDialogModule,
    IxtLayerManagerModule,
    IxtTreeModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

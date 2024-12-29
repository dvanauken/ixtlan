// public-api.ts

//---------------------------------- Core Components & Services ----------------------------------
export {
  IxtTableModule,
  IxtTableComponent,
  AirportCodeEditorComponent,
  CoordinateEditorComponent,
  BinaryEditorComponent,
  TableEditor,
  ColumnConfigs,
  EditService,
  FilterService,
  SortService,
  SelectionService,
  PaginationService
 } from './components/ixt-table/ixt-table.index';
 
 export {
  IxtDialogModule,
  IxtDialogComponent,
  IxtDialogService
 } from './components/ixt-dialog/ixt-dialog.index';
 
 export {
  IxtTabsetModule,
  IxtTabComponent,
  IxtTabsetComponent,
  ITabContent, 
  ITabsetConfig
 } from './components/ixt-tabset/ixt-tabset.index';
 
 //------------------------------------ Basic UI Components -------------------------------------
 export { 
  IxtButtonModule,
  IxtButtonComponent,
  ButtonSize 
} from './components/ixt-button/ixt-button.index';

export { 
  IxtPanelModule,
  IxtPanelComponent 
} from './components/ixt-panel/ixt-panel.index';

export { 
  IxtMenuModule,
  IxtMenuComponent 
} from './components/ixt-menu/ixt-menu.index';

export { 
  IxtTreeModule,
  IxtTreeComponent 
} from './components/ixt-tree/ixt-tree.index';

export { 
  IxtAccordianModule,
  IxtAccordianComponent 
} from './components/ixt-accordian/ixt-accordian.index';

 //--------------------------------- Canvas & View Components ----------------------------------
 export {
  IxtCanvasModule,
  IxtCanvasComponent
 } from './components/ixt-canvas/ixt-canvas.index';
 
 //------------------------------------ Form Components ---------------------------------------
 export {
  IxtExpressionBuilderComponent,
  IxtExpressionBuilderModule
 } from './components/ixt-expression-builder/ixt-expression-builder.index';
 
 //----------------------------------- Diagram Components ------------------------------------
 export { 
  IxtDiagramModule,
  IxtDiagramComponent 
} from './components/ixt-diagram/ixt-diagram.index';

 export {
  IxtClazzDiagram,
  IxtClazzModule
 } from './components/ixt-diagram/types/clazz/ixt-clazz.index';
 
 export {
  IxtDeploymentDiagram,
  IxtDeploymentModule
 } from './components/ixt-diagram/types/deployment/ixt-deployment.index';
 
 export {
  IxtEbnfDiagram,
  IxtEbnfModule
 } from './components/ixt-diagram/types/EBNF/ixt-ebnf.index';
 
 export {
  IxtFlowDiagram,
  IxtFlowModule
 } from './components/ixt-diagram/types/flow/ixt-flow.index';
 
 export {
  IxtGanntDiagram,
  IxtGanntModule
 } from './components/ixt-diagram/types/gannt/gannt.index';
 
 export {
  IxtNetworkDiagram,
  IxtNetworkModule
 } from './components/ixt-diagram/types/network/ixt-network.index';
 
 export {
  IxtSankeyDiagram,
  IxtSankeyModule
 } from './components/ixt-diagram/types/sankey/ixt-sankey.index';
 
 export {
  IxtWireframeDiagram,
  IxtWireframeModule
 } from './components/ixt-diagram/types/wireframe/ixt-wireframe.index';
 
//-------------------------------- Map & Layer Components ----------------------------------
export {
  // Components & Modules
  IxtMapModule,
  IxtMapComponent,
  IxtLayerComponent,
  
  // Services
  MapService,
  GeoProcessingService,
  LayerRenderService,
  LayerEventService,
  LayerStateService,
  MapErrorService,
  RouteProcessorService,
  
  // Types & Interfaces
  MapDimensions,
  MapState,
  MapContainer,
  MapSelection,
  PathSelection,
  MapServiceState,
  LayerEventHandlers,
  LayerRenderOptions,
  LayerState,
  MapError,
  MapErrorCode,
  RouteProcessingConfig,
  GeoFeatureProperties,
  GeoProcessingOptions,
} from './components/ixt-map/ixt-map.index';


//----------------------------- Utility & Layout Components --------------------------------
 export {
  IxtSplitPaneComponent,
  IxtSplitPaneModule
 } from './components/ixt-splitpane/index';
 
export {
  IxtCalendarComponent,
  IxtCalendarModule
} from './components/ixt-calendar/ixt-calendar.index';
 
 //------------------------------------ Theme Exports --------------------------------------
export {
  ThemeVariant,
  ThemeColor,
  ThemeColors
} from './components/theme/theme.types';
 
export {
  baseThemeColors,
  unitedThemeColors
} from './components/theme/theme.colors';


export {
  IxtFormModule,
  IxtInputModule,
  IxtSelectModule,
  IxtTextModule,
  IxtDateModule,
  IxtTimeModule,
  IxtBinaryModule
} from './components/ixt-form/ixt-form.index';
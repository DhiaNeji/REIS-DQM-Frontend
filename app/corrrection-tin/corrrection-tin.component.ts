import { Component, OnInit, ɵConsole } from '@angular/core';

import { Module,AllModules, GridApi, Events, EventService, GridOptions, IServerSideDatasource, IServerSideGetRowsParams } from '@ag-grid-enterprise/all-modules';
import { Page } from '../Pagination/page';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../service.service';
import { ValidateButtonComponent } from '../cellRenderers/validate-button/validate-button.component';

@Component({
  selector: 'app-corrrection-tin',
  templateUrl: './corrrection-tin.component.html',
  styleUrls: ['./corrrection-tin.component.scss']
})
export class CorrrectionTinComponent implements OnInit {
  ngOnInit(){
  }
  public options2
  public gridApi:GridApi;
  public gridColumnApi;
  public edited_data_length;
  public modules: Module[] = AllModules;
  public columnDefs;
  public rowClassRules
  public GridOptions:GridOptions ;
  public defaultColDef;
  public rowSelection
  public rowModelType;
  public paginationPageSize;
  public getRowNodeId
  public cacheBlockSize;
  public maxBlocksInCache
  public rowData: [];
  public Length
  public frameworkComponents
  rowStyle
  getRowStyle
  isRowSelectable
  isErroneousNations
  isSearching
  public autoGroupColumnDef;
  public components;
  public overlayLoadingTemplate
  public selected = 'CIN';
  public isFinished:boolean=false
  constructor(private toastr:ToastrService,private service:ServiceService) {
    this.options2= {
      title: {
        text: 'Historique de nettoyage',
        fontSize: 18,
      },
      subtitle: { text: 'Powered By : Vneuron' },
      series: [
        {
          data: [ { religion: 'Lignes traitées', population: 4159000 },
          { religion: 'Lignes ignorées', population: 97000 },
          { religion: 'Lignes non encore traitées', population: 456000 },],
          type: 'pie',
          labelKey: 'religion',
          angleKey: 'population',
          label: { minAngle: 0 },
          callout: { strokeWidth: 2 },
          fills: [
            '#5EB5EF',
            '#FDD676',
            '#FFA1B5',
            '#f9ca23',
            '#f0932b',
            '#eb4c4b',
            '#6ab04c',
            '#7ed6df',
          ],
          strokes: [
            '#b28553',
            '#b35555',
            '#829a3e',
            '#ae8d19',
            '#a8671e',
            '#a43535',
            '#4a7b35',
            '#58969c',
          ],
        },
      ],
      legend:{enabled:true,position:'bottom',color:'red'}
    };
    this.service.getProgcess("6").subscribe(res=>{
      this.Length=res.data_length
      this.options2= {
        title: {
          text: 'Commencé à',
          fontSize: 15,
        },
        subtitle: { text: new Date(res.started_on).toLocaleString(),fontSize:18 },
        series: [
          {
            data: [ { religion: 'Lignes traitées', population: res.edited_data_length},
            { religion: 'Lignes ignorées', population: res.ignored_data_length},
            { religion: 'Lignes restées', population: res.data_length-(res.edited_data_length+res.ignored_data_length)},],
            type: 'pie',
            labelKey: 'religion',
            angleKey: 'population',
            label: { minAngle: 0 },
            callout: { strokeWidth: 2 },
            fills: [
              '#5EB5EF',
              '#FDD676',
              '#FFA1B5',
              '#f9ca23',
              '#f0932b',
              '#eb4c4b',
              '#6ab04c',
              '#7ed6df',
            ],
            strokes: [
              '#b28553',
              '#b35555',
              '#829a3e',
              '#ae8d19',
              '#a8671e',
              '#a43535',
              '#4a7b35',
              '#58969c',
            ],
          },
        ],
        legend:{enabled:true,position:'bottom',color:'black'}
      };
     })
    this.overlayLoadingTemplate='<span class="ag-overlay-loading-center">Mise à jour en cours</span>';
    this.columnDefs = [
      {

        field: 'id',
        maxWidth: 75,
        hide:true
      },
      {
        field: 'nid',
        editable:true,
        cellEditor:ValidationCellEditor
      },
      {
        field:'tin',
        header:'type d\identifiant national',
        editable:true,
        width:500,
        cellEditor:'agSelectCellEditor',
        cellEditorParams: {
          values: ['Cin', 'Passeport', 'Carte de séjour', 'Matricule fiscal', 'Identifiant unique','Registre de commerce']
      }
      },
      {
        field: 'first_name',
        headerName:'Nom',
      },
      {
        field: 'last_name',
        headerName:'Prenom',
      },
      {
        field: 'birthdate',
        headerName:'Date de naissance',
      },
      {
        field: 'step_6',
        minWidth: 200,
      },
      {
        field:'Ne pas traiter',
        checkboxSelection:true,
        selectable:true
      },
      {
        field:'Action',
      cellRenderer: 'ValidateButtonComponent',
      }
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 90,
      resizable: true,
    };
    this.rowModelType = 'serverSide';
    this.paginationPageSize = 4;
    this.cacheBlockSize = 4;
    this.maxBlocksInCache=1;
    this.rowSelection='multiple';
  this.getRowNodeId = function(data) {
    return data.id;
  };

  this.frameworkComponents = {
    ValidateButtonComponent:ValidateButtonComponent
  };
  this.getRowStyle= function(params) {
    if(params.data!=null)
   {
    if (params.data.step_6=='false') {
        return { 'pointer-events': 'none', opacity: '1',background: '#FFEEBC' }
    }
    else
    {

       if(params.data.step_6=='true')
{      console.log('azeazeqdr')

         return {'pointer-events': 'none', opacity: '1',background: '#DFF0D8'};

}     else
      return {background: '#F6C5C9'};
    }
  }
}
}

  dataSource:IServerSideDatasource={
    getRows:(params:IServerSideGetRowsParams)=>{
      this.service.get_data("6",params.request.startRow,params.request.endRow).subscribe(response=>{
        params.successCallback(response,this.Length)
      })
    }
  }
  onGridReady(params)
  {
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.dataSource)
}
  edit(event)
  {
    if(event.data.step_6!=null)
    {
    this.overlayLoadingTemplate='<span class="ag-overlay-loading-center">Mise à jour en cours</span>';
    this.gridApi.showLoadingOverlay()
    this.toastr.info("Mise à jour en cours")
    this.service.update_data("6",event.data,event.rowIndex).subscribe(res=>{
      this.edited_data_length=res
      this.toastr.success("Mise à jour effectuée avec succès")
      this.service.getProgcess("6").subscribe(res=>{
        this.gridApi.hideOverlay()
        this.options2= {
          title: {
            text: 'Commencé à',
            fontSize: 15,
          },
          subtitle: { text: new Date(res.started_on).toLocaleString(),fontSize:18 },
          series: [
            {
              data: [ { religion: 'Lignes traitées', population: res.edited_data_length},
              { religion: 'Lignes ignorées', population: res.ignored_data_length},
              { religion: 'Lignes restées', population: res.data_length-(res.edited_data_length+res.ignored_data_length)},],
              type: 'pie',
              labelKey: 'religion',
              angleKey: 'population',
              label: { minAngle: 0 },
              callout: { strokeWidth: 2 },
              fills: [
                '#5EB5EF',
                '#FDD676',
                '#FFA1B5',
                '#f9ca23',
                '#f0932b',
                '#eb4c4b',
                '#6ab04c',
                '#7ed6df',
              ],
              strokes: [
                '#b28553',
                '#b35555',
                '#829a3e',
                '#ae8d19',
                '#a8671e',
                '#a43535',
                '#4a7b35',
                '#58969c',
              ],
            },
          ],
          legend:{enabled:true,position:'bottom',color:'black'}
        };
       })
    },error=>{
        this.toastr.error("Mise à jour echouée")
      }) } }
onChangeSelection()
{
}
rowSelectedHandler($event)
{
  this.gridApi.getRowNode($event.data.id).setSelected(true)
  this.gridApi.getRowNode($event.data.id).setDataValue('step_6','false')
}
prepareData(){
  this.toastr.toastrConfig.positionClass='toast-bottom-right'
  this.isSearching=true
  this.toastr.info("Fetching data from the Server!<div class='spinner-grow text-light' role='status'>",'Fetcing',{
    enableHtml:true
  })
  this.service.clear().subscribe(res=>{
  this.service.prepare_data("4").then(data=>{
  this.toastr.clear()
  this.toastr.success("data ready","done")
  this.isSearching=false
  this.isErroneousNations=true
})})
}
clear()
{

}
}
function ValidationCellEditor(xxx) {}
ValidationCellEditor.prototype.init = function(params) {
  this.tin=params.data.tin
  console.log(this.tin)
  this.eGui = document.createElement('div');
  this.eGui.innerHTML = `
    <input value=${params.value} />
  `;
  this.eInput = this.eGui.querySelector('input');
  this.eInput.addEventListener('input', this.inputChanged.bind(this));

}

ValidationCellEditor.prototype.inputChanged = function(event) {
  const val = event.target.value;
  if(!this.isValid(val)) {
    this.eInput.classList.add('invalid-cell');
  } else {
    this.eInput.classList.remove('invalid-cell');
  }
}

ValidationCellEditor.prototype.isValid = function(value) {
return true
}
ValidationCellEditor.prototype.getValue = function() {
  return this.eInput.value;
}

ValidationCellEditor.prototype.isCancelAfterEnd = function() {
  return !this.isValid(this.eInput.value);
}

ValidationCellEditor.prototype.getGui = function() {
  return this.eGui;
}

ValidationCellEditor.prototype.destroy = function() {
  this.eInput.removeEventListener('input', this.inputChanged);
}

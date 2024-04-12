import { Component, OnInit, ViewChild} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination'
import { MatCheckbox } from '@angular/material/checkbox'
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComentariosModalComponent } from '../comentarios-modal/comentarios-modal.component';
import {MatInputModule} from '@angular/material/input';


@Component({
  selector: 'app-tabla-registros',
  standalone: true,
  imports: [MatTableModule,CommonModule,MatCheckbox,FormsModule,MatInputModule,PaginationModule],
  templateUrl: './tabla-registros.component.html',
  styleUrl: './tabla-registros.component.css'
})
export class TablaRegistrosComponent implements OnInit{
  features_data: any;
  features_pages: any;
  // Conexion con el componente ComentariosModalComponent
  @ViewChild(ComentariosModalComponent) modalComponent!: ComentariosModalComponent;
  modalRef? : BsModalRef;
  // Define las columnas de la tabla
  displayedColumns: string[] = ['id', 'magnitude', 'place', 'time', 'tsunami', 'mag_type', 'title', 'latitude', 'longitude', 'url','comentarios'];
// Filtros
  selectedMag_types: string[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  selectedPageSize: number = 50;
  params: object = {per_page:this.selectedPageSize};
  idFilter: string = '';
  constructor(private apiService: ApiService, private modalService: BsModalService) { }
  
// Carga la tabla al iniciar
  ngOnInit(): void {
    this.getData()
  }
  // Transforma la data de la API para ser utilizada por la tabla
  transformData(data: any): any[] {
    let transformedData: any[] = [];

    // Itera sobre cada array dentro de la data
    for (let item in data) {
        // Transformar cada elemento del array y agregarlo al nuevo array
        transformedData.push({
          id: data[item].attributes.external_id,
          id_comments: data[item].id,
          magnitude: data[item].attributes.magnitude,
          place: data[item].attributes.place,
          time: data[item].attributes.time,
          tsunami: data[item].attributes.tsunami,
          mag_type: data[item].attributes.mag_type,
          title: data[item].attributes.title,
          latitude: data[item].attributes.coordinates.latitude,
          longitude: data[item].attributes.coordinates.longitude,
          url: data[item].links.external_url
        });
    }
    return transformedData;
  }
// Establece los filtros de mag_type
  filtrar(magType: string){
    if (this.selectedMag_types.includes(magType)) {
      this.selectedMag_types = this.selectedMag_types.filter(type => type !== magType);
    } else {
      this.selectedMag_types.push(magType);
    }
  }
  // Cambia la cantidad de registros que se ven por pagina
  changePageSize(size: number): void {
    this.selectedPageSize = size;
    this.params = {per_page:this.selectedPageSize};
    this.getData();
  }
  // Cambia la pagina de la tabla
  paginatorChange(event: PageChangedEvent): void {
    this.currentPage = event.page - 1;
    this.params = { page: this.currentPage + 1, per_page: this.selectedPageSize }
    this.getData();
  }
// Recarga los registros de la tabla aplicando los filtros
  getData(){
    const params = {
      id: this.idFilter,
      ...this.params,
      mag_type: this.selectedMag_types
    }
    this.apiService.getFeatures(params).subscribe(
      (data: any) => {
        this.features_data = this.transformData(data.data);
        this.features_pages = data.pagination;
        this.totalPages = this.features_pages.total;
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  // Muestra el modal con los respectivos comentarios del feature
  showComments(id_comments:number){
    this.modalRef = this.modalService.show(ComentariosModalComponent,{
      initialState: {
        id: id_comments
      }
    })
  }
}

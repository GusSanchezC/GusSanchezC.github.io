import { Component, OnInit} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox'
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tabla-registros',
  standalone: true,
  imports: [MatTableModule,CommonModule,MatCheckbox,MatPaginatorModule,FormsModule],
  templateUrl: './tabla-registros.component.html',
  styleUrl: './tabla-registros.component.css'
})
export class TablaRegistrosComponent implements OnInit{
  sismos_data: any;
  sismos_pages: any;
  comments_data: any;
  // Define las columnas de la tabla
  displayedColumns: string[] = ['id', 'magnitude', 'place', 'time', 'tsunami', 'mag_type', 'title', 'latitude', 'longitude', 'url','comentarios'];
// Filtros
  selectedMag_types: string[] = [];
  selectedPageSize: number = 50;
  currentPage: number = 0;
  totalPages: number = 0;
  params: object = {page: this.currentPage + 1,per_page:this.selectedPageSize};
  idFilter: string = '';
  constructor(private apiService: ApiService) { }
// Carga la tabla al iniciar
  ngOnInit(): void {
    this.apiService.getSismos({per_page: this.selectedPageSize}).subscribe(
      (data: any) => {
        this.sismos_data = this.transformData(data.data);
        this.sismos_pages = data.pagination; //Obtener paginacion
        this.currentPage = this.sismos_pages.current_page;
        this.totalPages = this.sismos_pages.total;
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  // Transforma la data de la API para ser utilizada por la tabla
  transformData(data: any): any[] {
    let transformedData: any[] = [];

    // Iterar sobre cada array dentro del objeto
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
        // console.log(transformedData)
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
  paginatorChange(event: any) {
    // Llamar a la función para obtener datos con los nuevos parámetros de paginación
    this.currentPage = event.pageIndex;
    this.selectedPageSize = event.pageSize
    this.params = { page: this.currentPage + 1, per_page: this.selectedPageSize }
    this.getDataWithParams();
  }
// Recarga los registros de la tabla aplicando los filtros
  getDataWithParams(){
    const params = {
      id: this.idFilter,
      ...this.params,
      mag_type: this.selectedMag_types
    }
    this.apiService.getSismos(params).subscribe(
      (data: any) => {
        this.sismos_data = this.transformData(data.data);
        this.sismos_pages = data.pagination;
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  
  showComments(id:number){
    this.apiService.getComments(id.toString()).subscribe(
      (data: any) => {
        this.comments_data = data;
        console.log(this.comments_data)
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
}

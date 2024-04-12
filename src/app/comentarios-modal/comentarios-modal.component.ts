import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal'
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-comentarios-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './comentarios-modal.component.html',
  styleUrl: './comentarios-modal.component.css'
})
export class ComentariosModalComponent {
  id: number = 0;
  commentsData: any;
  nuevoComentario: string = "";
  modalRef2?: BsModalRef;
  constructor(public modalRef: BsModalRef, private apiService: ApiService,private modalService: BsModalService) {}
  ngOnInit() {
    this.getComments();
  }
  getComments(){
    this.apiService.getComments(this.id.toString()).subscribe(
      (data: any) => {
        this.commentsData = data;
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template);
  }
  guardarComentario() {
    const commentData = {
      id: this.id,
      body: this.nuevoComentario
    }; // Datos del comentario a enviar
    this.apiService.addComment(this.id.toString(),commentData).subscribe(
      (response: any) => {
        console.log('Comentario guardado:', response);
        this.modalRef2?.hide();
        this.getComments();
      },
      error => {
        console.error('Error al guardar el comentario:', error);
      }
    );
  }
}

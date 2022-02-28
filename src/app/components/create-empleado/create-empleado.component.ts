import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {

  createEmpleados: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Empleado';

  constructor(private fb: FormBuilder,
    private _empleadosService: EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {

    this.createEmpleados = this.fb.group({
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      documento: ["", Validators.required],
      salario: ["", Validators.required],

    })

    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id)
  }

  ngOnInit(): void {
    this.esEditar();

  }

  agregarEditarEmpleado() {
    this.submitted = true;

    if (this.createEmpleados.invalid) {
      return;
    }

    if (this.id === null) {
      this.agregarEmpleado();
    } else {
      this.editarEmpleado(this.id);
    }

  }

  agregarEmpleado() {

    const empleado: any = {
      nombre: this.createEmpleados.value.nombre,
      apellido: this.createEmpleados.value.apellido,
      documento: this.createEmpleados.value.documento,
      salario: this.createEmpleados.value.salario,
      fechaCrecion: new Date(),
      fechaActualizacion: new Date()

    }
    this.loading = true;
    this._empleadosService.agregarEmpleado(empleado).then(() => {
      this.toastr.success('El empleado fue registrado con exito', 'Empleado Registrado', { positionClass: 'toast-bottom-right' });
      this.loading = false;
      this.router.navigate(['/list-empleados'])

    }).catch(error => {
      console.log(error);
      this.loading = false;
    })


  }
  editarEmpleado(id: string) {

    const empleado: any = {
      nombre: this.createEmpleados.value.nombre,
      apellido: this.createEmpleados.value.apellido,
      documento: this.createEmpleados.value.documento,
      salario: this.createEmpleados.value.salario,      
      fechaActualizacion: new Date()
    }

    this.loading = true;

    this._empleadosService.actualizarEmpleado(id, empleado).then(() => {
      this.loading = false;
      this.toastr.info('El empleado fue modificado con exito', 'Empleado modificado', {
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/list-empleados']);
    })
  }
  esEditar() {
    this.titulo = 'Editar Empleado'
    if (this.id !== null) {
      this.loading = true,
        this._empleadosService.getEmpleado(this.id).subscribe(data => {
          console.log(data.payload.data()['nombre']);

          this.createEmpleados.setValue(
            {
              nombre: data.payload.data()['nombre'],
              apellido: data.payload.data()['apellido'],
              documento: data.payload.data()['documento'],
              salario: data.payload.data()['salario'],

            })
        })
    }

  }

}

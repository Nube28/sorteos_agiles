export enum RolUsuario {
  ORGANIZADOR = 'ORGANIZADOR',
  CLIENTE = 'CLIENTE',
}
export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  nombreUsuario: string;
  rol: RolUsuario;
  organizadordId?: number;
  clienteId?: number;
}
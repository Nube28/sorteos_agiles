export enum RolUsuario {
  ORGANIZADOR = 'ORGANIZADOR',
  CLIENTE = 'CLIENTE',
}
export interface IUsuario {
  id: string;
  nombre: string;
  apellidos: string;
  nombreUsuario: string;
  rol: RolUsuario;
  organizadorId?: string;
  clienteId?: string;
}
export interface Sorteo {
  id: number;
  urlImg: string | null;
  descripcion: string;
  premio: string;
  periodoInicioVenta: string; // En JSON, las fechas son strings
  periodoFinVenta: string;
  costo: number;
  fechaSorteo: string;
  tiempoLimitePago: string;
  organizadorId: number;
}
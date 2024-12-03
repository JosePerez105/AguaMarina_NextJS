export type Reserva = {
    id_reservation: number;
    id_user: number;
    name_client: string;
    start_date: string;
    end_date: string;
    address: string;
    city : string;
    neighborhood : string;
    total_reservation : number;
    status: boolean;
    details: any[];
  };
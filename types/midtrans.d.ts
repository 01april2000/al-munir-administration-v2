declare module "midtrans-client" {
  export namespace CoreApi {
    interface Config {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    }

    interface Transaction {
      status(orderId: string): Promise<TransactionStatus>;
    }
  }

  export namespace Snap {
    interface Config {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    }

    interface Transaction {
      createTransaction(params: TransactionParams): Promise<TransactionResponse>;
    }
  }

  export interface TransactionStatus {
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    currency: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status?: string;
    status_code: string;
    settlement_time?: string;
  }

  export interface TransactionParams {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details?: {
      first_name: string;
      last_name?: string;
      email: string;
      phone?: string;
    };
    item_details?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    custom_field1?: string;
    custom_field2?: string;
    custom_field3?: string;
    enabled_payments?: string[];
  }

  export interface TransactionResponse {
    token: string;
    redirect_url: string;
  }

  export class CoreApi {
    constructor(config: CoreApi.Config);
    transaction: CoreApi.Transaction;
  }

  export class Snap {
    constructor(config: Snap.Config);
    transaction: {
      createTransaction(params: TransactionParams): Promise<TransactionResponse>;
    };
  }

  export const MidtransClient: {
    CoreApi: typeof CoreApi;
    Snap: typeof Snap;
  };
}

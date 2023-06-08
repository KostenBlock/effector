export interface ReviewI {
    createAt: string;
    feadback: string;
    idMongo: string;
    name: string;
    statusPublished: string;
}

export type ReviewPayloadI = Omit<ReviewI, 'createAt' | 'idMongo'>;
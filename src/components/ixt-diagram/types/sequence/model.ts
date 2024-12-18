// src/app/sequence-diagram/models.ts
export interface Participant {
    type: 'actor' | 'component';
    name: string;
    x?: number;
}

export interface Message {
    from: string;
    to: string;
    text: string;
    type: 'sync' | 'return';
    y?: number;
}

export interface DiagramData {
    participants: Participant[];
    messages: Message[];
}


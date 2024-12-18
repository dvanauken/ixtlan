// test/types.ts
export interface Participant {
    type: 'actor' | 'component';
    name: string;
}

export interface Message {
    from: string;
    to: string;
    text: string;
    type: 'sync' | 'return';
}

export interface DiagramData {
    participants: Participant[];
    messages: Message[];
}
// test/parser.ts
import { DiagramData, Participant, Message } from './types';

export class DiagramParser {
    parse(input: string): DiagramData {
        const lines = input.trim().split('\n').map(line => line.trim());
        const participants: Participant[] = [];
        const messages: Message[] = [];

        lines.forEach(line => {
            if (line.startsWith('actor')) {
                const name = line.replace('actor', '').trim();
                participants.push({ type: 'actor', name });
            }
            else if (line.startsWith('participant')) {
                const name = line.replace('participant', '').trim();
                participants.push({ type: 'component', name });
            }
            else if (line.includes('->')) {
                const parts = line.split('->');
                if (parts.length === 2) {
                    const [from, rest] = parts;
                    const [to, text] = rest.split(':').map(s => s.trim());
                    messages.push({
                        from: from.trim(),
                        to: to.trim(),
                        text: text || '',
                        type: 'sync'
                    });
                }
            }
            else if (line.includes('-->')) {
                const parts = line.split('-->');
                if (parts.length === 2) {
                    const [from, rest] = parts;
                    const [to, text] = rest.split(':').map(s => s.trim());
                    messages.push({
                        from: from.trim(),
                        to: to.trim(),
                        text: text || '',
                        type: 'return'
                    });
                }
            }
        });

        return { participants, messages };
    }
}
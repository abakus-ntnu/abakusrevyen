import type { ChatMessage } from "@/features/chat/types";

export const exampleMessages: ChatMessage[] = [
    {
        id: 1,
        display_name: 'Moderator',
        body: 'Velkommen! Chatten åpner før forestillingen.',
        created_at: '2026-02-12T18:45:00+01:00',
    },
    {
        id: 2,
        display_name: 'Kari',
        body: 'Gleder meg til sendingen!',
        created_at: '2026-02-12T18:52:00+01:00',
    },
    {
        id: 3,
        display_name: 'Ola',
        body: 'Lyden og bildet fungerer fint her.',
        created_at: '2026-02-12T18:58:00+01:00',
    }
]
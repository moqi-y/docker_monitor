//chatService.ts
interface ChatResponse {
    success: boolean;
    message: string;
}

export class ChatService {
    private static instance: ChatService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = 'http://localhost:8000/api';
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public async streamChat(
        onChunkReceived: (chunk: string) => void,
        abortController: AbortController,
        userMsg: string
    ): Promise<ChatResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/stream-chat?userMsg=${userMsg}`,{
                signal: abortController.signal
            });

            if (!response.body) {
                throw new Error('Response body is not a stream');
            }

            const reader = response.body.getReader();
            let accumulatedResponse = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = new TextDecoder().decode(value, { stream: true });
                accumulatedResponse += chunk;

                onChunkReceived(accumulatedResponse);
            }

            return {
                success: true,
                message: accumulatedResponse
            };
        } catch (error: any) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Request aborted');
                return {
                    success: false,
                    message: 'Request aborted'
                };
            }
            return {
                success: false,
                message: error.message
            }
        }
    }
}

export default ChatService.getInstance();
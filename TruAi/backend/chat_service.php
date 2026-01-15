<?php
/**
 * TruAi Chat Service
 * 
 * Handles chat conversations and message history
 * 
 * @package TruAi
 * @version 1.0.0
 */

class ChatService {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Send a message and get AI response
     */
    public function sendMessage($userId, $conversationId, $message, $model = 'auto') {
        if (empty($message)) {
            throw new Exception('Message is required');
        }

        // Create conversation if not exists
        if (!$conversationId) {
            $conversationId = $this->createConversation($userId, $this->generateTitle($message));
        }

        // Save user message
        $this->saveMessage($conversationId, 'user', $message);

        // Get AI response (simulated)
        $aiResponse = $this->getAIResponse($message, $model);
        $this->saveMessage($conversationId, 'assistant', $aiResponse, $model);

        // Update conversation timestamp
        $this->db->execute(
            "UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = :id",
            [':id' => $conversationId]
        );

        return [
            'conversation_id' => $conversationId,
            'message' => [
                'role' => 'assistant',
                'content' => $aiResponse,
                'model' => $model
            ]
        ];
    }

    /**
     * Get all conversations for a user
     */
    public function getConversations($userId) {
        return $this->db->query(
            "SELECT c.*, 
                    (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count
             FROM conversations c
             WHERE c.user_id = :user_id
             ORDER BY c.updated_at DESC",
            [':user_id' => $userId]
        );
    }

    /**
     * Get a specific conversation with messages
     */
    public function getConversation($conversationId) {
        $result = $this->db->query(
            "SELECT * FROM conversations WHERE id = :id LIMIT 1",
            [':id' => $conversationId]
        );

        if (empty($result)) {
            return null;
        }

        $conversation = $result[0];
        $conversation['messages'] = $this->db->query(
            "SELECT * FROM messages WHERE conversation_id = :id ORDER BY created_at ASC",
            [':id' => $conversationId]
        );

        return $conversation;
    }

    /**
     * Delete a conversation
     */
    public function deleteConversation($conversationId) {
        $this->db->execute(
            "DELETE FROM messages WHERE conversation_id = :id",
            [':id' => $conversationId]
        );
        
        $this->db->execute(
            "DELETE FROM conversations WHERE id = :id",
            [':id' => $conversationId]
        );
    }

    private function createConversation($userId, $title) {
        $this->db->execute(
            "INSERT INTO conversations (user_id, title) VALUES (:user_id, :title)",
            [':user_id' => $userId, ':title' => $title]
        );
        
        return $this->db->lastInsertId();
    }

    private function saveMessage($conversationId, $role, $content, $model = null) {
        $this->db->execute(
            "INSERT INTO messages (conversation_id, role, content, model_used) 
             VALUES (:conv_id, :role, :content, :model)",
            [
                ':conv_id' => $conversationId,
                ':role' => $role,
                ':content' => $content,
                ':model' => $model
            ]
        );
    }

    private function generateTitle($message) {
        $title = substr($message, 0, 50);
        if (strlen($message) > 50) {
            $title .= '...';
        }
        return $title;
    }

    private function getAIResponse($message, $model) {
        // This is a placeholder. In production, integrate with actual AI APIs
        $responses = [
            "I understand your question about: " . substr($message, 0, 30) . "...",
            "Based on your request, I can help you with that.",
            "Let me analyze that for you. Here's what I found...",
            "That's an interesting question. Let me explain..."
        ];
        
        return $responses[array_rand($responses)] . "\n\nThis is a simulated response using model: " . $model;
    }
}

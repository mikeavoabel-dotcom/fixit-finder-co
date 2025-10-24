import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_username?: string;
  receiver_username?: string;
}

const Conversation = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [otherUserName, setOtherUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchMessages();
    setupRealtimeSubscription();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          read
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch user profiles separately
      const senderIds = [...new Set(data?.map(m => m.sender_id) || [])];
      const receiverIds = [...new Set(data?.map(m => m.receiver_id) || [])];
      const allUserIds = [...new Set([...senderIds, ...receiverIds])];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', allUserIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const messagesWithProfiles = data?.map(msg => ({
        ...msg,
        sender_username: profilesMap.get(msg.sender_id)?.username,
        receiver_username: profilesMap.get(msg.receiver_id)?.username,
      })) || [];

      setMessages(messagesWithProfiles);

      // Get other user's name
      if (messagesWithProfiles.length > 0) {
        const otherUserId = messagesWithProfiles[0].sender_id === user.id 
          ? messagesWithProfiles[0].receiver_id 
          : messagesWithProfiles[0].sender_id;
        setOtherUserName(profilesMap.get(otherUserId)?.username || 'User');
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', userId)
          .single();
        setOtherUserName(profile?.username || 'User');
      }

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', userId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === userId && newMsg.receiver_id === currentUserId) ||
            (newMsg.sender_id === currentUserId && newMsg.receiver_id === userId)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: userId,
        content: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      <SimpleHeader />
      
      <div className="border-b bg-card sticky top-16 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/inbox')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-sm">
              {otherUserName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">{otherUserName}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto container mx-auto px-4 py-6">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-card sticky bottom-16">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              className="resize-none"
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || loading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Conversation;

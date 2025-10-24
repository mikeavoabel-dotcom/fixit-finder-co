import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Conversation {
  user_id: string;
  username: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const Inbox = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setCurrentUserId(user.id);

      // Get all messages involving the current user
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get all unique user IDs
      const userIds = [...new Set(messages?.flatMap(m => [m.sender_id, m.receiver_id]).filter(id => id !== user.id) || [])];
      
      // Fetch profiles for all users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Group messages by conversation
      const conversationsMap = new Map<string, Conversation>();

      messages?.forEach((msg: any) => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const otherUser = profilesMap.get(otherUserId);

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            user_id: otherUserId,
            username: otherUser?.username || 'User',
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0,
          });
        }

        // Count unread messages
        if (msg.receiver_id === user.id && !msg.read) {
          const conv = conversationsMap.get(otherUserId)!;
          conv.unread_count++;
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-semibold text-foreground mb-6">Messages</h1>
        
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>Loading...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Start a conversation with a professional</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <Card
                key={conv.user_id}
                className="p-4 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => navigate(`/conversation/${conv.user_id}`)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {conv.username.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{conv.username}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conv.last_message_time).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.last_message}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <Badge variant="default" className="ml-2">
                      {conv.unread_count}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Inbox;

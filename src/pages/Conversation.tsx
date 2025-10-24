import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_username?: string;
  receiver_username?: string;
  attachment_url?: string;
  attachment_type?: string;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          read,
          attachment_url,
          attachment_type
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
          .maybeSingle();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File, userId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('message-attachments')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('message-attachments')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let attachmentUrl = null;
      let attachmentType = null;

      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile, user.id);
        attachmentType = selectedFile.type;
      }

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: userId,
        content: newMessage.trim() || (selectedFile ? `Sent a ${selectedFile.type.startsWith('image/') ? 'photo' : 'file'}` : ''),
        attachment_url: attachmentUrl,
        attachment_type: attachmentType,
      });

      if (error) throw error;

      setNewMessage("");
      removeSelectedFile();
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
                  {message.attachment_url && message.attachment_type?.startsWith('image/') && (
                    <img 
                      src={message.attachment_url} 
                      alt="Attachment" 
                      className="rounded-lg mb-2 max-w-full max-h-64 object-cover cursor-pointer"
                      onClick={() => window.open(message.attachment_url, '_blank')}
                    />
                  )}
                  {message.attachment_url && !message.attachment_type?.startsWith('image/') && (
                    <a 
                      href={message.attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mb-2 text-sm underline hover:opacity-80"
                    >
                      <Paperclip className="w-4 h-4" />
                      View attachment
                    </a>
                  )}
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
          {selectedFile && (
            <div className="mb-2 flex items-center gap-2 p-2 bg-muted rounded-lg">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-muted-foreground/10 rounded flex items-center justify-center">
                  <Paperclip className="w-6 h-6" />
                </div>
              )}
              <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeSelectedFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
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
              disabled={(!newMessage.trim() && !selectedFile) || loading}
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

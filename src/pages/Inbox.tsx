import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";

const Inbox = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-semibold text-foreground mb-6">Inbox</h1>
        <div className="text-center py-16 text-muted-foreground">
          <p>No messages yet</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Inbox;

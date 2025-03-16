import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Chat from './Chat';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            className="h-14 w-14 rounded-full shadow-lg"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md md:max-w-lg p-0 h-[80vh] max-h-[600px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Chat with recruiters</DialogTitle>
          </DialogHeader>
          <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="h-full">
            <Chat
              recipientId={999} // Default to company chat
              companyData={{
                id: 999,
                name: 'LinkedIn',
                avatar: 'https://cdn-icons-png.flaticon.com/512/174/174857.png'
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
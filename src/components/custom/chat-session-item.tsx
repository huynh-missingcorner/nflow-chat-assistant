import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Archive, Trash } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/contexts/ChatContext";

interface ChatSessionItemProps {
  id: string;
  title: string;
  timestamp: string | undefined;
  isActive: boolean;
  onClick: () => void;
}

export function ChatSessionItem({
  id,
  title,
  timestamp,
  isActive,
  onClick,
}: ChatSessionItemProps) {
  const { updateSessionTitle, archiveSession, deleteSession } =
    useChatContext();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  async function handleRename() {
    await updateSessionTitle(id, newTitle);
    setIsRenameDialogOpen(false);
  }

  async function handleDelete() {
    await deleteSession(id);
    setIsDeleteDialogOpen(false);
  }

  async function handleArchive() {
    await archiveSession(id);
  }

  // When opening rename dialog, initialize with current title
  function openRenameDialog() {
    setNewTitle(title);
    setIsRenameDialogOpen(true);
  }

  return (
    <>
      <div
        className={`group flex items-center justify-between px-3 py-2 rounded-md ${
          isActive ? "bg-muted" : "hover:bg-muted/50"
        } transition-colors cursor-pointer`}
        onClick={onClick}
      >
        <div className="overflow-hidden">
          <div className="text-sm truncate">{title}</div>
          <div className="text-xs text-muted-foreground">{timestamp}</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                openRenameDialog();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleArchive();
              }}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter a new name"
            className="mt-4"
            autoFocus
          />
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!newTitle.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this chat? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

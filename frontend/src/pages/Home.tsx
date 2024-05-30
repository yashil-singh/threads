import CreatePost from "@/components/CreatePost";
import ProfileImg from "@/components/ProfileImg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  return (
    <>
      {/* Main Content */}
      <main className="py-5 max-w-[600px] m-auto w-full">
        <div className="border-b border-border flex p-5 items-center justify-between">
          <div className="flex gap-2 items-center w-full">
            <Link to="/">
              <ProfileImg url="asd" fallBackText="Y" width={36} height={36} />
            </Link>
            <div
              className="w-full cursor-text py-2"
              onClick={() => setOpenCreateModal(true)}
            >
              <p className="text-muted-foreground">Start a thread...</p>
            </div>
          </div>
          <Button variant={"outline"} onClick={() => setOpenCreateModal(true)}>
            Post
          </Button>
        </div>
      </main>

      <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
        <DialogContent className="bg-transparent border-0 p-0">
          <h1 className="text-center font-bold">New Thread</h1>
          {/* Create Thread Modal */}
          <CreatePost />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;

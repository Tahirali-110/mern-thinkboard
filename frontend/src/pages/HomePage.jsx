import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import RateLimitedUI from "../components/RAteLimitedUi";
import api from "../lib/axios";
import NotesNotFound from "../components/NotesNotFound";

 
const Homepage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");

        console.log(res.data);

        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes:", error);

        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      {!isRateLimited && (
        <div className="max-w-7xl mx-auto p-4 mt-6">
          {loading && (
            <div className="text-center text-primary py-10">
              Loading notes...
            </div>
          )}
          {notes.length === 0 && !isRateLimited && <NotesNotFound />}

          {!loading && notes.length === 0 && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold"></h2>
              <p className="text-base-content/60 mt-2">
                
              </p>
            </div>
          )}

          {!loading && notes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Homepage;
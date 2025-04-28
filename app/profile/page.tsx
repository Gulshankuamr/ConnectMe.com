"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);

  // Profile data
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  // Social links
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");

  // For saving
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSaving(true);
          // Save logic here
          setTimeout(() => {
            setIsSaving(false);
            toast({ title: "Profile updated successfully!" });
          }, 1500);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block font-semibold">Name</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Bio</label>
          <textarea
            className="border p-2 rounded w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Profile Picture URL</label>
          <input
            className="border p-2 rounded w-full"
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </div>

        {/* Social links */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">LinkedIn</label>
            <input
              className="border p-2 rounded w-full"
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">GitHub</label>
            <input
              className="border p-2 rounded w-full"
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">Twitter</label>
            <input
              className="border p-2 rounded w-full"
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">Instagram</label>
            <input
              className="border p-2 rounded w-full"
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className="block font-semibold">Website</label>
            <input
              className="border p-2 rounded w-full"
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";
import {
  FaExternalLinkAlt,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaTrash,
  FaTv,
} from "react-icons/fa";
import {
  addMatchStreamLink,
  deleteStreamLink,
  getMatchStreamLinks,
} from "../../api/admin/AdminStreamLinkApi";

const initialForm = {
  title: "",
  sourceName: "",
  url: "",
};

const getResponseMessage = (result, fallback) => {
  if(typeof result.data === "string"){
    return result.data;
  }

  return result.data?.message || result.data?.error || fallback;
};

const getStreamId = (streamLink) => {
  return streamLink.stream_link_id || streamLink.id;
};

const AdminStreamLinkManager = ({
  fixture,
  apiFixtureId: apiFixtureIdProp,
  defaultOpen = false,
  onActiveStreamsChange,
}) => {
  const apiFixtureId = apiFixtureIdProp || fixture?.api_fixture_id;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [streamLinks, setStreamLinks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(initialForm);

  const notifyActiveStreamsChange = (nextStreamLinks) => {
    if(typeof onActiveStreamsChange !== "function"){
      return;
    }

    onActiveStreamsChange(nextStreamLinks.filter((streamLink) => streamLink.is_active));
  };

  const loadStreamLinks = async () => {
    if(!apiFixtureId){
      setMessage("Missing API fixture id for this match.");
      return;
    }

    setLoading(true);
    setMessage("Loading stream links...");

    const result = await getMatchStreamLinks({ apiFixtureId });

    if(result.ok){
      const nextStreamLinks = result.data?.streamLinks || [];
      setStreamLinks(nextStreamLinks);
      notifyActiveStreamsChange(nextStreamLinks);
      setLoaded(true);
      setMessage(result.data?.message || "Stream links loaded");
    }else{
      setStreamLinks([]);
      setLoaded(true);
      setMessage(getResponseMessage(result, "Failed to load stream links"));
    }

    setLoading(false);
  };

  const handleToggleOpen = async () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    if(nextOpen && !loaded){
      await loadStreamLinks();
    }
  };

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAddStreamLink = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("Saving stream link...");

    const result = await addMatchStreamLink({
      apiFixtureId,
      title: form.title,
      sourceName: form.sourceName,
      url: form.url,
    });

    if(result.ok){
      const savedStreamLink = result.data?.streamLink;

      if(savedStreamLink){
        setStreamLinks((current) => {
          const savedId = getStreamId(savedStreamLink);
          const existingIndex = current.findIndex((item) => getStreamId(item) === savedId);

          if(existingIndex === -1){
            const nextStreamLinks = [savedStreamLink, ...current];
            notifyActiveStreamsChange(nextStreamLinks);

            return nextStreamLinks;
          }

          const nextStreamLinks = current.map((item) => getStreamId(item) === savedId ? savedStreamLink : item);
          notifyActiveStreamsChange(nextStreamLinks);

          return nextStreamLinks;
        });
      }

      setForm(initialForm);
      setMessage(result.data?.message || "Stream link saved successfully");
    }else{
      setMessage(getResponseMessage(result, "Failed to save stream link"));
    }

    setSaving(false);
  };

  const handleRemove = async (streamLink) => {
    const streamLinkId = getStreamId(streamLink);
    setRemovingId(streamLinkId);
    setMessage("Removing stream link...");

    const result = await deleteStreamLink({ streamLinkId });

    if(result.ok){
      setStreamLinks((current) => {
        const nextStreamLinks = current.filter((item) => getStreamId(item) !== streamLinkId);
        notifyActiveStreamsChange(nextStreamLinks);

        return nextStreamLinks;
      });
      setMessage(result.data?.message || "Stream link removed successfully");
    }else{
      setMessage(getResponseMessage(result, "Failed to remove stream link"));
    }

    setRemovingId(null);
  };

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-black/20">
      <button
        type="button"
        onClick={handleToggleOpen}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-gray-300 transition-all hover:text-white"
      >
        <span className="inline-flex items-center gap-2">
          <FaTv className="text-[#8b5cf6]" />
          Manage Streams
        </span>
        <span className="rounded-full bg-[#8b5cf6]/15 px-2 py-0.5 text-xs text-[#a78bfa]">
          {loaded ? streamLinks.length : "open"}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-[#2a2a2a] p-3">
          {message && (
            <p className="mb-3 rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-xs text-gray-300">
              {message}
            </p>
          )}

          <form onSubmit={handleAddStreamLink} className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr]">
            <label className="text-xs text-gray-400">
              Stream title
              <input
                type="text"
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                placeholder="Official stream"
                className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#8b5cf6]"
                required
              />
            </label>

            <label className="text-xs text-gray-400">
              Source name
              <input
                type="text"
                value={form.sourceName}
                onChange={(event) => updateForm("sourceName", event.target.value)}
                placeholder="YouTube, FIFA, TV channel..."
                className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#8b5cf6]"
              />
            </label>

            <label className="text-xs text-gray-400 lg:col-span-2">
              Stream URL
              <input
                type="url"
                value={form.url}
                onChange={(event) => updateForm("url", event.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#8b5cf6]"
                required
              />
            </label>

            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#7c3aed] disabled:bg-[#3f315f] disabled:cursor-not-allowed lg:col-span-2"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaPlus />
                  Add Stream Link
                </>
              )}
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaSpinner className="animate-spin text-[#8b5cf6]" />
                Loading stream links...
              </div>
            ) : streamLinks.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#2a2a2a] px-3 py-4 text-center text-sm text-gray-500">
                No stream links added for this match yet.
              </p>
            ) : (
              streamLinks.map((streamLink) => {
                const streamLinkId = getStreamId(streamLink);

                return (
                  <div key={streamLinkId} className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-white">{streamLink.title}</h4>
                        <p className="mt-1 text-xs text-gray-500">{streamLink.source_name || "No source name"}</p>
                        <a
                          href={streamLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex max-w-full items-center gap-2 text-xs text-[#a78bfa] hover:text-white"
                        >
                          <FaExternalLinkAlt className="shrink-0" />
                          <span className="truncate">{streamLink.url}</span>
                        </a>
                      </div>

                      <div className="lg:min-w-[110px]">
                        <button
                          type="button"
                          onClick={() => handleRemove(streamLink)}
                          disabled={removingId === streamLinkId}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition-all hover:bg-red-500/20 disabled:bg-[#111111] disabled:cursor-not-allowed"
                        >
                          {removingId === streamLinkId ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-3 inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white"
          >
            <FaTimes />
            Close stream manager
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminStreamLinkManager;

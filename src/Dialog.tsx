import { useCallback, useRef } from "react";

export default function Dialog() {
  const ref = useRef<HTMLDialogElement>(null);

  const show = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const close = useCallback(() => {
    ref.current?.close();
  }, [ref]);

  return (
    <>
      <button type="button" onClick={show} className="underline cursor-pointer">
        What is this?
      </button>
      <dialog
        ref={ref}
        className="m-auto my-8 max-w-lg bg-gray-900 p-3 rounded-lg shadow-lg text-inherit backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl">naultz's copypastas</h2>
          <button type="button" onClick={close} className="underline cursor-pointer">
            Close
          </button>
        </div>
        <p className="my-3">
          Did you ever hear the tragedy of Darth @Naultz24 The mod? I thought not. It’s
          not a story the streamer wouldn't tell you.
        </p>
        <p className="my-3">
          naultz24 was a well-known chatter in several twitch streams, perhaps most
          notably in A_Seagull's stream, where he was a moderator. He was notorious for
          his seemingly innumerable copypastas (humorous chat messages meant to be copied
          and pasted by other members of chat) as well as his kind demeanor and love of
          animals.
        </p>
        <p className="my-3">
          Sadly, naultz24 passed away in June of 2026. He made a huge impact on the
          community that has popped up around Seagull's stream, myself included, and I
          wanted to have a way to remember him. naultz was humble and would have likely
          declined any long-form eulogy (honestly I'm kind of pushing it with this,) so
          why not instead preserve his brand of humor for others to enjoy?
        </p>
        <p className="my-3">
          This site is a collection of <strong>over 600</strong> copy-pastable messages
          curated by the man himself, formerly in a Google doc distributed to only his
          most trusted memesters. Use the search bar to find a message relevant to what's
          happening in the stream you're watching, copy it, and paste as appropriate.
        </p>
        <p className="my-2 text-[14px] w-85 m-auto">
          <span className="font-bold text-orange-700">sheybey_</span>: If Naultz24 has a
          million fans, I'm one of the. If Naultz24 has 5 fans, I'm one of them. If
          Naultz24 has 1 fan, that one is me. If Naultz24 has no fans, I'm no longer
          alive. If the world is against Naultz24, I'm against the entire world.
        </p>
        <p>
          If you've spotted something broken, or if your CSS chops are better than mine,
          feel free to{" "}
          <a className="underline" href="https://github.com/sheybey/naultz.net">
            contribute a fix!
          </a>
        </p>
      </dialog>
    </>
  );
}

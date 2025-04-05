import { useEffect, useState, useRef } from "react";
import Masonry from "react-masonry-css";
import useStore from "../store/position";
import { Spinner } from "@material-tailwind/react";

function Home() {
  const posts = useStore((state) => state.posts);
  const setPosts = useStore((state) => state.setPosts);
  const scrollPosition = useStore((state) => state.scrollPosition);
  const setScrollPosition = useStore((state) => state.setScrollPosition);
  const [expandedPost, setExpandedPost] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!posts.length) {
      setPosts([
        {
          id: 1,
          title: "Cool Sunset",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV3ALtCbWcGPWh8IdWDbtX9_9aEdx9gLc9Vw&s",
          description:
            "A stunning sunset over the horizon, painted in warm hues of orange, pink, and purple, casting a serene glow over the landscape.",
        },
        {
          id: 2,
          title: "Mountains",
          image:
            "https://ipt.images.tshiftcdn.com/200626/x/0/best-aspect-ratios-for-landscape-photography-in-iceland-5.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883",
          description:
            "Majestic peaks under a clear blue sky, surrounded by lush green valleys and distant snow-capped ridges.",
        },
        {
          id: 3,
          title: "Rural Vibe",
          image:
            "https://thumbs.dreamstime.com/b/bright-clouds-blue-skies-vertical-wallpaper-nature-backgrounds-sky-mountains-wallpapers-laptops-smartphones-186215425.jpg",
          description:
            "Peaceful countryside with rolling hills, dotted with quaint farms and vibrant wildflowers swaying in the breeze.",
        },
        {
          id: 4,
          title: "Sunflower",
          image:
            "https://images.unsplash.com/photo-1597573337211-e1080012b84b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8OSUzQTE2fGVufDB8fDB8fHww",
          description:
            "Bright sunflowers swaying in the breeze, their golden petals stretching toward the sun in a vast field.",
        },
        {
          id: 5,
          title: "The Old Valley",
          image: "https://g2.img-dpreview.com/0092C98398254023B844D78BFF2EC71F.jpg",
          description:
            "An ancient valley steeped in history, with rugged cliffs and whispering winds carrying tales of old.",
        },
        {
          id: 6,
          title: "Winter",
          image:
            "https://phototraces.b-cdn.net/wp-content/uploads/2021/04/ptw_Travel_Photography_Blog_Canada_Montreal_First_Day_of_Spring.jpg",
          description:
            "A serene winter scene with fresh snow blanketing the ground, trees glistening under a pale morning light.",
        },
        {
          id: 7,
          title: "Arctic",
          image: "https://shotkit.com/wp-content/uploads/2021/07/4x3-aspect-ratio-jaime-reimer.jpg",
          description:
            "Chilly Arctic beauty under a pale sun, with icy waters reflecting the stark, frozen wilderness around.",
        },
        {
          id: 8,
          title: "Beach",
          image: "https://thumbs.dreamstime.com/b/aspect-ratio-beach-background-summer-concept-187699731.jpg",
          description:
            "Golden sands and crashing waves, with seagulls soaring overhead and the scent of saltwater in the air.",
        },
      ]);
    }
  }, [posts, setPosts]);

  const [topPadding, setTopPadding] = useState(10); // Default padding

  useEffect(() => {
    const checkIphoneWithDynamicIsland = () => {
      const userAgent = navigator.userAgent;
      const isIphone = /iPhone/.test(userAgent);
      const isDynamicIsland = window.innerWidth >= 375 && window.innerHeight >= 812;

      if (isIphone && isDynamicIsland) {
        setTopPadding(40); // Add extra padding for Dynamic Island
      }
    };

    checkIphoneWithDynamicIsland();
    window.addEventListener("resize", checkIphoneWithDynamicIsland);

    return () => window.removeEventListener("resize", checkIphoneWithDynamicIsland);
  }, []);

  const loadMorePosts = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newPosts = Array.from({ length: 4 }, (_, i) => ({
        id: posts.length + i + 1,
        title: `Post ${posts.length + i + 1}`,
        image: `https://via.placeholder.com/300x${300 + (i + page) * 100}`,
        description: `This is a dynamically loaded post number ${
          posts.length + i + 1
        } with some extra text to fill space and make it interesting.`,
      }));
      setPosts([...posts, ...newPosts]);
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollTop);
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, posts]);

  const breakpointCols = { default: 2 };
  const truncateDescription = (text, wordLimit = 10) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "…";
  };

  return (
    <>
    <div className="block h-24 " style={{ paddingTop: `${topPadding}px` }}>
      <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-3 search-bar ">
        <div className="flex items-center bg-gray-600 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400 ml-4"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder-gray-400"
          />
          <button className="px-6 py-3 text-white rounded-full transition-colors">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.5 3a7.5 7.5 0 015.96 12.28l4.53 4.53a1 1 0 01-1.42 1.42l-4.53-4.53A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      ref={containerRef}
      className="p-4 pt-2 mt-4 pb-16 overflow-y-auto h-screen no-scrollbar" // Added no-scrollbar class
    >
      <Masonry
        breakpointCols={breakpointCols}
        className="flex -ml-4"
        columnClassName="pl-4"
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
            <div className="p-2">
              <p className="text-sm font-semibold">{post.title}</p>
              <p className="text-xs text-gray-600">
                {expandedPost === post.id ? (
                  post.description
                ) : (
                  <>
                    {truncateDescription(post.description)}{" "}
                    {post.description.split(" ").length > 10 && (
                      <span
                        onClick={() => setExpandedPost(post.id)}
                        className="bold cursor-pointer hover:underline"
                      >
                        See more
                      </span>
                    )}
                  </>
                )}
                {expandedPost === post.id && (
                  <span
                    onClick={() => setExpandedPost(null)}
                    className="cursor-pointer hover:underline ml-1"
                  >
                    See less
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </Masonry>
      <div ref={observerRef} className="h-10" />
      {loading && (
       <div className="mb-5 items-center justify-center flex">
       <Spinner className="w-8 h-8"/>
     </div>
      )}
    </div>
    </>
  );
}

export default Home;
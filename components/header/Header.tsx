"use client"; // Required for interactivity
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import "./header.css";
import DigitalWatch from "../digital-watch/DigitalWatch";

// Type for fallback member and fetched user data
interface Member {
  name: string;
  image: string;
}

interface FetchedUser {
  name: string;
  image?: string;
}

const Header = () => {
  const [isMembersVisible, setIsMembersVisible] = useState(false);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLImageElement>(null);
  const today = new Date();

  // Hardcoded fallback users
  const fallbackMembers: Member[] = [
    { name: "Lalita", image: "/images/user-heart-fill.png" },
    { name: "Januka", image: "/images/user-heart-fill.png" },
    { name: "Didi", image: "/images/user-heart-fill.png" },
    { name: "Thulobhai", image: "/images/user-heart-fill.png" },
    { name: "Kanchha", image: "/images/user-heart-fill.png" },
    { name: "Buba", image: "/images/user-heart-fill.png" },
    {
      name: "Thulo bhanja",
      image: "/images/user-heart-fill.png",
    },
    { name: "Sano bhanja", image: "/images/user-heart-fill.png" },
    { name: "Biansha", image: "/images/user-heart-fill.png" },
    { name: "Gatte", image: "/images/user-heart-fill.png" },
    { name: "Buka", image: "/images/user-heart-fill.png" },
    { name: "Ashwini bhanja", image: "/images/user-heart-fill.png" },
    { name: "Kiyana", image: "/images/user-heart-fill.png" },
    { name: "Gantte", image: "/images/user-heart-fill.png" },
    { name: "Biansha", image: "/images/user-heart-fill.png" },
    { name: "Sudhir", image: "/images/user-heart-fill.png" },
    { name: "Peshal", image: "/images/user-heart-fill.png" },
  ];

  const { data } = useSession();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fuzzy matching helper
  const hasFourCharSubstringMatch = (str1: string, str2: string): boolean => {
    const clean1 = str1.toLowerCase().replace(/\s+/g, "");
    const clean2 = str2.toLowerCase().replace(/\s+/g, "");

    for (let i = 0; i <= clean1.length - 8; i++) {
      const sub = clean1.substring(i, i + 4);
      if (clean2.includes(sub)) {
        return true;
      }
    }
    return false;
  };

  // Fetch members on mount
  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const res = await fetch("/api/auth/getallusers");
        const data = await res.json();
        const fetched: FetchedUser[] = data.users || [];

        // Merge fetched users with fallback members using fuzzy match
        const merged = fallbackMembers.map((fallback) => {
          const match = fetched.find((user) =>
            hasFourCharSubstringMatch(user.name, fallback.name)
          );
          return match
            ? { name: match.name, image: match.image || fallback.image }
            : fallback;
        });

        setAllMembers(merged);
      } catch (error) {
        setAllMembers(fallbackMembers); // Fallback to hardcoded
      } finally {
        setLoading(false);
      }
    };

    fetchAllMembers();
  }, []);

  const logoutHandler = () => {
    signOut();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMembersVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="header bg-primary text-white shadow-sm sticky-top py-3">
      <h1 className="logo-text mb-0 fs-6 fs-sm-6 fs-md-5 fs-lg-4 fs-xl-3 fw-bold">
        <Link href="/" className="text-white text-decoration-none">
          {`हाम्रो परिवार ${data?.user?.name ? data?.user?.name : ""}`}
        </Link>
      </h1>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo and Family Members Dropdown */}
          <div className="d-flex align-items-center">
            <div className="position-relative me-3">
              {!data?.user ? (
                <button
                  className={`btn btn-light rounded-circle p-2 p-md-3 d-flex align-items-center justify-content-center ${
                    isMembersVisible ? "active bg-warning" : ""
                  }`}
                  aria-label="Family members"
                >
                  <span className="fs-6">👨‍👩‍👧‍👦</span>
                </button>
              ) : (
                <img
                  src={
                    data?.user?.image
                      ? data?.user?.image
                      : "/images/user-heart-fill.png"
                  }
                  alt="User"
                  height="50px"
                  width="50px"
                  className="btn btn-info rounded-circle p-1 d-flex align-items-center justify-content-center"
                  onClick={() => setIsMembersVisible(!isMembersVisible)}
                  ref={dropdownRef}
                />
              )}

              {isMembersVisible && (
                <div
                  className="members-dropdown position-absolute start-0 mt-2 bg-white text-dark rounded shadow-lg p-3 z-3"
                  style={{ minWidth: "250px" }}
                >
                  <h3 className="dropdown-title fs-5 fw-bold mb-3 text-center border-bottom pb-2">
                    परिवार सदस्य
                  </h3>
                  <ul className="members-list list-unstyled">
                    {allMembers.map((member, index) => (
                      <li
                        key={index}
                        className="member-item py-2 px-3 rounded hover-bg-light"
                      >
                        <div className="d-flex align-items-center fs-6 fs-md-6 fs-lg-5 fs-xl-4">
                          <img
                            src={member.image}
                            alt={member.name}
                            height="40px"
                            width="40px"
                            className="rounded-circle me-2"
                          />
                          <span className="text-truncate">{member.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* Current Date */}
          <div className="d-none d-lg-block bg-white text-primary rounded-pill px-3 py-1 fw-semibold">
            {formattedDate}
          </div>
          <div className="current-date d-none d-md-block bg-white text-primary rounded-pill px-3 py-1 fw-semibold">
            {<DigitalWatch />}
          </div>
          <Link
            href="/about"
            className="nav-link btn btn-success btn-sm px-3 py-1 rounded-pill"
          >
            बारेमा
          </Link>
          <Link
            href="/all-contents"
            className="nav-link btn btn-success btn-sm px-3 py-1 rounded-pill"
          >
            संस्मरण
          </Link>
          {/* Navigation Links */}
          <nav className="nav-links d-flex align-items-center gap-3">
            <Link
              href="/image-upload"
              className="nav-link btn btn-success btn-sm px-3 py-1 rounded-pill"
            >
              <i className="fas fa-cloud-upload-alt me-2"></i>फोटो अपलोड
            </Link>
            <Link
              href="/"
              className="nav-link btn btn-success btn-sm px-3 py-1 rounded-pill"
            >
              <i className="fas fa-images me-2"></i>एल्बम
            </Link>

            {data?.user ? (
              <button
                onClick={logoutHandler}
                className="nav-link btn btn-danger btn-sm px-3 py-1 rounded-pill"
              >
                <i className="fas fa-sign-out-alt me-2"></i>लगआउट
              </button>
            ) : (
              <Link
                href="/login"
                className="nav-link btn btn-success btn-sm px-3 py-1 rounded-pill"
              >
                <i className="fas fa-sign-in-alt me-2"></i>लगइन
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

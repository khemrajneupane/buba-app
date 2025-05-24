"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import "./header.css";
import DigitalWatch from "../digital-watch/DigitalWatch";

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
  const [isMenuDropdownVisible, setIsMenuDropdownVisible] = useState(false);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef<HTMLImageElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const { data } = useSession();

  const fallbackMembers: Member[] = [
    { name: "Lalita", image: "/images/user-heart-fill.png" },
    { name: "Januka", image: "/images/user-heart-fill.png" },
    { name: "Didi", image: "/images/user-heart-fill.png" },
    { name: "Thulobhai", image: "/images/user-heart-fill.png" },
    { name: "Kanchha", image: "/images/user-heart-fill.png" },
    { name: "Buba", image: "/images/user-heart-fill.png" },
    { name: "Thulo bhanja", image: "/images/user-heart-fill.png" },
    { name: "Sano bhanja", image: "/images/user-heart-fill.png" },
    { name: "Biansha", image: "/images/user-heart-fill.png" },
    { name: "Gatte", image: "/images/user-heart-fill.png" },
    { name: "Buka", image: "/images/user-heart-fill.png" },
    { name: "Ashwini bhanja", image: "/images/user-heart-fill.png" },
    { name: "Kiyana", image: "/images/user-heart-fill.png" },
    { name: "Gantte", image: "/images/user-heart-fill.png" },
    { name: "Sudhir", image: "/images/user-heart-fill.png" },
    { name: "Peshal", image: "/images/user-heart-fill.png" },
  ];

  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const res = await fetch("/api/auth/getallusers");
        const data = await res.json();
        const fetched: FetchedUser[] = data.users || [];

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
        setAllMembers(fallbackMembers);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMembers();
  }, []);

  const logoutHandler = () => {
    signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMembersVisible(false);
      }
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header bg-primary text-white shadow-sm sticky-top py-3">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          {/* हाम्रो परिवार button */}
          <div className="position-relative me-3" ref={menuDropdownRef}>
            <button
              className="btn btn-light rounded-pill px-3 py-1 fw-bold"
              onClick={() => setIsMenuDropdownVisible((prev) => !prev)}
            >
              हाम्रो परिवार {data?.user?.name ? data.user.name : ""}
            </button>
            {isMenuDropdownVisible && (
              <div className="position-absolute start-0 mt-2 bg-white text-dark rounded shadow-lg p-3 z-3">
                <div className="d-flex flex-column gap-2">
                  <Link
                    href="/about"
                    className="btn btn-success btn-sm rounded-pill"
                  >
                    बारेमा
                  </Link>
                  <Link
                    href="/all-contents"
                    className="btn btn-success btn-sm rounded-pill"
                  >
                    संस्मरण
                  </Link>
                  <Link
                    href="/content-upload"
                    className="btn btn-success btn-sm rounded-pill"
                  >
                    अपलोड
                  </Link>
                  <Link
                    href="/image-upload"
                    className="btn btn-success btn-sm rounded-pill"
                  >
                    फोटो अपलोड
                  </Link>
                  <Link
                    href="/"
                    className="btn btn-success btn-sm rounded-pill"
                  >
                    एल्बम
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Family Members Dropdown */}
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
                  data.user.image
                    ? data.user.image
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
                      <div className="d-flex align-items-center fs-6">
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

          {/* Date and Digital Watch */}
          <div className="d-none d-lg-block bg-white text-primary rounded-pill px-3 py-1 fw-semibold">
            {formattedDate}
          </div>
          <div className="current-date d-none d-md-block bg-white text-primary rounded-pill px-3 py-1 fw-semibold">
            <DigitalWatch />
          </div>

          {/* Auth Links */}
          <nav className="nav-links d-flex align-items-center gap-3">
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

"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { ADToBS } from "bikram-sambat-js";
import "./header.css";
import DigitalWatch from "../digital-watch/DigitalWatch";
import Image from "next/image";

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

  const today = new Date();
  const nepaliDate = ADToBS(today);
  const formattedDate = nepaliDate;

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
    <header className="headers">
      {/* हाम्रो परिवार button */}
      <div className="position-relative me-1" ref={menuDropdownRef}>
        <button
          className="btn btn-light rounded-pill px-3 py-1 fw-bold"
          onClick={() => setIsMenuDropdownVisible((prev) => !prev)}
        >
          {data?.user?.name ? data.user.name : "परिवार"}
        </button>

        {isMenuDropdownVisible && (
          <div className="position-absolute start-0 mt-2 bg-white text-dark rounded shadow-lg p-3 z-3">
            <div className="d-flex flex-column gap-2">
              <Link
                href="/about"
                className="btn btn-success btn-sm rounded-pill"
                onClick={() => setIsMenuDropdownVisible((prev) => !prev)}
              >
                बारेमा
              </Link>
              <Link
                href="/all-contents"
                className="btn btn-success btn-sm rounded-pill"
                onClick={() => setIsMenuDropdownVisible((prev) => !prev)}
              >
                संस्मरण
              </Link>
              <Link
                href="/content-upload"
                className="btn btn-success btn-sm rounded-pill"
                onClick={() => setIsMenuDropdownVisible((prev) => !prev)}
              >
                अपलोड
              </Link>
              <Link
                href="/image-upload"
                className="btn btn-success btn-sm rounded-pill"
                onClick={() => setIsMenuDropdownVisible((prev) => !prev)}
              >
                फोटो अपलोड
              </Link>
              <Link
                href="/"
                className="btn btn-success btn-sm rounded-pill"
                onClick={() => setIsMenuDropdownVisible((prev) => !prev)}
              >
                एल्बम
              </Link>
            </div>
          </div>
        )}
      </div>
      <Link
        href="/quiz"
        className="bg-white text-primary rounded-pill mx-3 my-2 px-3 py-2 fw-bold"
      >
        खेल्नुहोस्
      </Link>

      {/* Date and Digital Watch */}
      <div className="d-none d-lg-block bg-white text-primary rounded-pill px-3 py-1 fw-semibold">
        {formattedDate}
      </div>
      <div className="current-date d-none d-md-block bg-white text-primary rounded-pill px-3 py-1 fw-semibold">
        <DigitalWatch />
      </div>

      {/* Auth Links */}
      <nav className="">
        {data?.user ? (
          <button
            onClick={logoutHandler}
            className="bg-white text-primary rounded-pill mx-3 my-2 px-3 py-2 fw-bold"
          >
            लगआउट
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-white text-primary rounded-pill mx-3 my-2 px-3 py-2 fw-bold"
          >
            लगइन
          </Link>
        )}
      </nav>
      {/* Family Members Dropdown */}
      <div className="position-relative">
        {!data?.user ? (
          <button
            onClick={() => setIsMembersVisible(!isMembersVisible)}
            className={`btn btn-light rounded-circle p-2 p-md-3 d-flex align-items-center justify-content-center ${
              isMembersVisible ? "active bg-warning" : ""
            }`}
            aria-label="Family members"
          >
            👨‍👩
          </button>
        ) : (
          <Image
            src={
              data.user.image ? data.user.image : "/images/user-heart-fill.png"
            }
            alt="User"
            height={30}
            width={30}
            className="btn btn-info rounded-circle p-1 d-flex align-items-center justify-content-center"
            onClick={() => setIsMembersVisible(!isMembersVisible)}
            ref={dropdownRef}
          />
        )}

        {isMembersVisible && (
          <div className="members-dropdown">
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
    </header>
  );
};

export default Header;

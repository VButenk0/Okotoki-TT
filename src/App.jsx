/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import "./App.css";
import coins from "./coins/coins.json";
import sprite from "./assets/sprite.svg";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoins, setFilteredCoins] = useState(coins);
  const [favoriteCoins, setFavoriteCoins] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [filter, setFilter] = useState("all");

  const dropdownRef = useRef();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteCoins"));
    if (storedFavorites) {
      setFavoriteCoins(storedFavorites);
    }
  }, []);

  useEffect(() => {
    setFilteredCoins(
      coins.filter((coin) =>
        coin.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleDocumentClick = (event) => {
    if (
      isDropdownOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    } else if (!isDropdownOpen) {
      const dropdownWidth = 210;
      const dropdownHeight = 230;
      let top = event.clientY;
      let left = event.clientX;

      if (top + dropdownHeight > window.innerHeight) {
        top = window.innerHeight - dropdownHeight;
      }

      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth;
      }

      setDropdownPosition({ top, left });
      setIsDropdownOpen(true);
    }
  };

  const handleOptionClick = (coin) => {
    let updatedFavorites;
    if (favoriteCoins.includes(coin)) {
      updatedFavorites = favoriteCoins.filter((item) => item !== coin);
    } else {
      updatedFavorites = [...favoriteCoins, coin];
    }
    setFavoriteCoins(updatedFavorites);
    localStorage.setItem("favoriteCoins", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [isDropdownOpen]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div>
      <h1 className="title">
        {isDropdownOpen
          ? "Now click anywhere to close the dropdown"
          : "Click anywhere to open the dropdown"}
      </h1>
      {isDropdownOpen && (
        <div
          className="select-container"
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 100,
          }}
        >
          <div className="dropdown">
            <div className="input-wrpr">
              <svg width="16" height="16">
                <use href={sprite + "#search"}></use>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <svg
                  className="close-btn"
                  width="20"
                  height="20"
                  onClick={clearSearch}
                >
                  <use href={sprite + "#close"}></use>
                </svg>
              )}
            </div>
            <div className="buttons-wrpr">
              <button className="button" onClick={() => setFilter("favorites")}>
                <svg width="16" height="16">
                  <use href={sprite + "#star-full"}></use>
                </svg>
                Favorite
              </button>
              <button onClick={() => setFilter("all")}>All</button>
            </div>
            <div className="options">
              {(filter === "all" ? filteredCoins : favoriteCoins).map(
                (coin, index) => (
                  <div
                    key={index}
                    className={"option"}
                    onClick={() => handleOptionClick(coin)}
                  >
                    <svg width="16" height="16">
                      {favoriteCoins.includes(coin) ? (
                        <use href={sprite + "#star-full"}></use>
                      ) : (
                        <use href={sprite + "#star-empty"}></use>
                      )}
                    </svg>
                    {coin}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

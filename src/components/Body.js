import RestraurantCard from "./RestraurantCard";
// import restrautList from "../utils/mockData";
import { useContext, useEffect, useState } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnline";
import WhatOnMind from "./WhatOnMind";
import UserContext from "../utils/UserContext";
import uesRestrauntData from "../utils/useRestrauntData";
const Body = () => {
  //Local State Variables - Super powerful variable
  const [restraunt, setRestraunt] = useState([]); //here it did array destruturing
  // const arr = useState(resList);
  // const [restraunt,setRestraunt] =arr; // these are he same thing
  const [filteredRestraunt, setFilteredRestraunt] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [whatsOnYourMind, setWhatsOnYourMind] = useState();
  const [topRestraunt, setTopRestraunt] = useState();
  const [current, setCurrent] = useState(0);

  // whenever state variables update, react triggers a reconciliation cycle(RE - render component)
  console.log("body rendered");

  const { logggdInUser, setUserName } = useContext(UserContext);

  useEffect(() => {
    getData();
  
  }, []);


  const resData = uesRestrauntData();
  console.log(resData,"data from custom hook")

  async function getData() {
   try{ const data = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=26.176673&lng=91.760003&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );
    const json = await data.json();
    console.log(
      json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    const restruntList = json.data.cards.filter((res) => {
      return res.card.card.id === "restaurant_grid_listing";
    });
    setWhatsOnYourMind(
      json.data?.cards?.filter((res) => {
        return res?.card?.card?.id === "whats_on_your_mind";
      })
    );
    setTopRestraunt(json.data?.cards[1]?.card?.card);
    console.log(whatsOnYourMind, "in mind");

    setRestraunt(
      restruntList[0]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    // const card

    setFilteredRestraunt(
      restruntList[0]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );

    console.log(json.data);
    console.log(filteredRestraunt, "filterr");
    console.log(topRestraunt, "restrauntList");
   }
   catch(err){
    console.log(err)
   }
  }

  const onlineStatus = useOnlineStatus();
  console.log(onlineStatus);
  //Early return
  if (!onlineStatus) {
    return (
      <h1 className="p-10 font-semibold text-xl">
        Looks like you are offline please check your internet connection
      </h1>
    );
  }

  function handleSearchInput(e) {
    setSearchText(e.target.value);
    // console.log(searchText)
  }
  //conditional rendering
  // if(restraunt.length===0)
  // {
  //   return <Shimmer/>
  // }

  function prevSlide() {
    if (current === 0) {
      setCurrent(
        topRestraunt?.gridElements?.infoWithStyle?.restaurants.length - 1 - 7
      );
    } else {
      setCurrent(current - 4);
    }
  }
  function nextSlide() {
    console.log("clicked");
    if (
      current >=
      topRestraunt?.gridElements?.infoWithStyle?.restaurants.length - 1 - 7
    ) {
      setCurrent(0);
    } else {
      setCurrent(current + 4);
    }
  }

  return restraunt?.length === 0 ? (
    <Shimmer />
  ) : (
    <div className=" w-[20rem] md:min-w-[961px] mx-auto">
      {whatsOnYourMind.length !== 0 && (
        <div className="overflow-hidden my-10 ">
          <WhatOnMind whatsOnYourMind={whatsOnYourMind} />
        </div>
      )}
      <hr></hr>
      {topRestraunt?.gridElements?.infoWithStyle?.restaurants?.length !== 0 && (
        <div className=" overflow-hidden mt-6 ">
          <div>
            <div className="flex justify-between mb-6">
              <h1 className="font-medium text-xs md:text-2xl">
                {topRestraunt?.header?.title}
              </h1>
              <div>
                <button className="px-2 hover:bg-sky-100" onClick={prevSlide}>
                  ⬅
                </button>
                <button className="px-2 hover:bg-slate-100" onClick={nextSlide}>
                  ➡
                </button>
              </div>
            </div>
            <div
              className="flex  w-[7000px] transition ease-out duration-40"
              style={{ transform: `translateX(-${current * 4}%)` }}
            >
              {topRestraunt?.gridElements?.infoWithStyle?.restaurants?.map(
                (restraunt) => (
                  <Link
                    to={"/restraunts/" + restraunt.info.id}
                    key={restraunt.info.id}
                  >
                    {" "}
                    <RestraurantCard resData={restraunt} />{" "}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
      <hr className="my-10"></hr>

      <div className="flex justify-center items-center mt-6 mb-4">
        <input
          className="mr-4 mt-1 p-1 w-24 text-[6px] md:text-[15px] md:w-60 border rounded outline-none "
          type="text"
          placeholder="Search"
          onChange={handleSearchInput}
        ></input>
        <div>
          <button
            className="bg-green-300 rounded  p-1 px-2 mr-2 md:text-[15px]  text-[8px]  md:text-md"
            onClick={() => {
              const filterData = restraunt.filter((res) => {
                return res.info.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
              });
              setFilteredRestraunt(filterData);
              console.log(filterData, "fill");
            }}
          >
            Search
          </button>

          <button
            className="bg-rose-300 rounded  p-1 px-2 mr-6 text-[8px] md:text-[15px]"
            onClick={() => {
              let filterRes = restraunt.filter((res) => res.info.avgRating > 4.2);
              setFilteredRestraunt(filterRes);
              console.log("button clicked", filterRes);
            }}
          >
            Top rated restraunts
          </button>

          <input
            className=" "
            value={logggdInUser}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap    ">
        {/* //componenet */}
        {filteredRestraunt?.map((restraunt) => (
          <Link to={"/restraunts/" + restraunt.info.id} key={restraunt.info.id}>
            {" "}
            <RestraurantCard resData={restraunt} />
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Body;

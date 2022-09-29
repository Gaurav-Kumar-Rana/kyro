import React from "react";
import "./style.css";
import { useEffect, useState } from "react";
import { catFactAction } from "../appStore/actions/catFactsAction";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

function CatFact(props) {
  const dispatch = useDispatch();

  const data = useSelector((state) => {
    return state.catfactsList;
  }, shallowEqual);

  useEffect(() => {
    dispatch(catFactAction());
  }, []);

  const renderList = (data) => {
    const list = [];
    for (const key in data) {
      list.push(<li key={key}>{data[key].fact}</li>);
      //console.log(key,data[key]);
    }
    return list;
  };

  return (
    <div className="App">
      <h1>Cat Facts List</h1>
      <ul>{data && renderList(data)}</ul>
    </div>
  );
}

export default CatFact;

import React, { useState, useRef, useCallback } from 'react';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import Spinner from '../spinner/Spinner';

import './list-items.css';

export default function ListItems() {
  const [pageNumber, setPageNumber] = useState(1);

  const { items, hasMore, loading, error } = useInfiniteScroll(pageNumber);

  const observer = useRef();
  // Here we are setting a reffrence for the last item on the array to call the next page when it shows on the screen.
  // For more details see https://reactjs.org/docs/hooks-reference.html#useref
  const lastElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    // Here we are rendering a item with ref if its the last item, otherwise just render normal item
    <>
      <div className="item">
        <p>Subject</p>
        <p>Priority</p>
        <p>Status</p>
        <p>Description</p>
      </div>
      {items.map((item, index) => {
        if (items.length === index + 1) {
          return (
            <div ref={lastElement} className="item" key={index}>
              <p>{item.name}</p>
              <p>{item.stargazers_count}</p>
              <p>{item.open_issues_count}</p>
              <p>{item.description}</p>
              <div className="item-deatils">
                <div className="name-of-item">
                  <p></p>
                </div>
                <div className="item-historical-info">
                  <div className="item-stars">
                    <span>Priority:</span> {item.stargazers_count}
                  </div>

                  <div className="item-issues">
                    <span>Status:</span> {item.open_issues_count}
                  </div>
                </div>
                <div className="item-description">
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="item" key={index}>
              <p>{item.name}</p>
              <p>{item.stargazers_count}</p>
              <p>{item.open_issues_count}</p>
              <p>{item.description}</p>
            </div>
          );
        }
      })}
      <div>{loading && <Spinner />}</div>
      <div className="error">{error && 'Error'}</div>
    </>
  );
}

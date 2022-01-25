/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import React, { useState } from 'react';

const Rating = ({ rating, setRating, displayFlex, onClick, experienceRating }) => {
  const [hovered, setHovered] = useState(0);
  const selectedIcon = '★';
  const deselectedIcon = '☆';
  const stars = [
    {
      id: 1,
      name: 'Bad',
    },
    {
      id: 2,
      name: '',
    },
    {
      id: 3,
      name: '',
    },
    {
      id: 4,
      name: '',
    },
    {
      id: 5,
      name: 'Excellent',
    },
  ];
  const changeRating = (newRating) => {
    setRating(newRating);
  };
  const hoverRating = (rate) => {
    setHovered(rate);
  };
  return (
    <div className="w-full card-text text-center">
      <div className="rating flex " style={{ fontSize: '3em', color: '#ffc83d' }}>
        {stars.map(({ id, name }) => {
          return (
            <div
              key={id}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                changeRating(id);
                onClick();
              }}
              onMouseEnter={() => {
                hoverRating(id);
              }}
              onMouseLeave={() => {
                hoverRating(0);
              }}
            >
              <div className={classNames('mr-4 -mt-2', displayFlex ? 'text-4xl' : 'text-2xl')}>
                {experienceRating
                  ? experienceRating >= id
                    ? selectedIcon
                    : deselectedIcon
                  : rating < id
                  ? hovered < id
                    ? deselectedIcon
                    : selectedIcon
                  : selectedIcon}
              </div>
              {/* {!displayFlex && (
                <div className="text-sm text-black font-medium -ml-2 -mt-4">{name}</div>
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Rating;

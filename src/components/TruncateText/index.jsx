import React, { useState } from 'react';

function TruncateText(props) {
  const {
    lines,
    id,
    dangerouslySetInnerHTML,
    charCountForNotShowingButtons,
    buttonPosition,
    children,
    className,
  } = props;
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {!showMore ? (
        <div
          className={`${className} text-justify`}
          style={{
            '-webkit-line-clamp': lines,
            display: '-webkit-box',
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
          }}
        >
          {dangerouslySetInnerHTML ? (
            // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{ __html: children }} />
          ) : (
            children
          )}
        </div>
      ) : (
        <div className={`${className} text-justify`}>
          {dangerouslySetInnerHTML ? (
            // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{ __html: children }} />
          ) : (
            children
          )}
        </div>
      )}
      {!showMore && children?.length > charCountForNotShowingButtons && (
        <div
          className={buttonPosition === 'right' ? 'text-right' : 'text-left'}
          id={`show-more-${id}`}
          onClick={() => setShowMore(true)}
        >
          <a className="font-semibold text-blue-600 text-xs"> Show More </a>
        </div>
      )}
      {showMore && children?.length > charCountForNotShowingButtons && (
        <div
          className={buttonPosition === 'right' ? 'text-right' : 'text-left'}
          id={`show-less-${id}`}
          onClick={() => setShowMore(false)}
        >
          <a className="font-semibold text-blue-600 text-xs"> Show Less </a>
        </div>
      )}
    </>
  );
}

export default TruncateText;

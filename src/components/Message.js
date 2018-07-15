import React from 'react';

const Message = (props) => (
  <div className={props.answer === 'correct' ? "registration-success message" : "registration-fail message"}>
    <h4>{props.answer}</h4>
  </div>
);

export default Message;

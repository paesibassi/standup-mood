import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';

const ExampleToast = ({ children }) => {
  const [show, toggleShow] = useState(true);

  return (
    <>
      {!show && <Button onClick={() => toggleShow(true)}>Show Toast</Button>}
      <Toast show={show} onClose={() => toggleShow(false)}>
        <Toast.Header>
          <strong className="mr-auto">React-Bootstrap</strong>
        </Toast.Header>
        <Toast.Body>{children}</Toast.Body>
      </Toast>
    </>
  );
};

ExampleToast.propTypes = { children: PropTypes.string.isRequired };

export default ExampleToast;

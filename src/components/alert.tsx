import React, { FC } from 'react';
import Alert from 'react-bootstrap/Alert';
import useGlobalContext from '../context/context';

const AlertMessage: FC = () => {
  const {
    isAlertVisible, messageHeading, messageBody, handleCloseAlert,
  } = useGlobalContext();

  return (
    <Alert show={isAlertVisible} variant="success" onClose={handleCloseAlert} dismissible>
      <Alert.Heading>{messageHeading}</Alert.Heading>
      <p>
        {messageBody}
      </p>
    </Alert>
  );
};

export default AlertMessage;

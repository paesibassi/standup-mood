import React, { FC } from 'react';
import Alert from 'react-bootstrap/Alert';

type Props = {
    isAlertVisible: boolean;
    messageHeading: string;
    messageBody: string;
    handleCloseAlert: ()=>void;
};

const AlertMessage: FC<Props> = ({
  isAlertVisible, messageHeading, messageBody, handleCloseAlert,
}) => (
  <Alert show={isAlertVisible} variant="success" onClose={handleCloseAlert} dismissible>
    <Alert.Heading>{messageHeading}</Alert.Heading>
    <p>
      {messageBody}
    </p>
  </Alert>
  );

export default AlertMessage;

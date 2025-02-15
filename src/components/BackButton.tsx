import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { MouseEvent } from 'react';

function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={(e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        navigate(-1);
      }}
      type='back'
    >
      &larr; &nbsp; Back
    </Button>
  );
}

export default BackButton;

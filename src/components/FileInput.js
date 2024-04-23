import React, { useEffect, useRef } from 'react';

const FileInput = ({ value, onChange }) => {
  const inputRef = useRef();

  useEffect(() => {
    if (value === '') {
      inputRef.current.value = ''; // Clear the input if value is empty
    } else {
      const dataTransfer = new DataTransfer();
      value.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }
  }, [value]);

  return <input type="file" ref={inputRef} />;
};

export default FileInput;

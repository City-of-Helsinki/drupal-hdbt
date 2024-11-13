import { FileInput as HDSFileInput, FileInputProps as HDSFileInputProps } from 'hds-react';
import React from 'react';

type FileInputProps = Omit<HDSFileInputProps, 'onChange'> & {
  name: string;
};

export const FileInput = (props: FileInputProps) => {
  const [file, setFile] = React.useState([]);

  console.log(file);

  return (
    <React.Fragment>
      <HDSFileInput
        {...props}
        onChange={(file) => console.log(file)}
      />
    </React.Fragment>
  )
};

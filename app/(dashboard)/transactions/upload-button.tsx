import { Button } from "../../../components/ui/button";
import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";

type Props = {
  onUpload: (data: any) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button size="sm" className="lg:w-auto flex items-center" {...getRootProps()}>
          <Upload className="mr-0 size-4" />
         
        </Button>
      )}
    </CSVReader>
  );
};
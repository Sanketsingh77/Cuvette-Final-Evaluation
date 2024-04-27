import LoadingOverlay from "react-loading-overlay-nextgen";
import HashLoader from "react-spinners/HashLoader";

export default function Loader({ active, children }) {
  return (
    <LoadingOverlay active={active} spinner={<HashLoader color="#FF7373" />}>
      {children}
    </LoadingOverlay>
  );
}

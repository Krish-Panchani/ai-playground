import { Toaster } from "react-hot-toast";

import { toastOptions } from "../../lib/toast";

const AppToaster = () => (
  <Toaster
    position="top-center"
    reverseOrder={false}
    gutter={12}
    toastOptions={toastOptions}
  />
);

export default AppToaster;
